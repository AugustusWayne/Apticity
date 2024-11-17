module apticity::nft_minter {
    use std::string::{String};
    use std::vector;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_framework::object::{Object};
    use aptos_framework::coin;

    /// Custom error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const ECOLLECTION_NOT_INITIALIZED: u64 = 2;
    const EINVALID_MINT_TIME: u64 = 3;
    const ENOT_ENOUGH_FUNDS: u64 = 4;

    /// Struct to store collection data
    struct CollectionData has key {
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
        current_supply: u64,
        mint_start_time: u64,
        mint_price: u64,
    }

    /// Event emitted when NFT is minted
    struct MintEvent has drop, store {
        token_id: address,
        creator: address,
        recipient: address,
        timestamp: u64,
    }

    public entry fun initialize_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
        mint_start_time: u64,
        mint_price: u64
    ) {
        collection::create_unlimited_collection(
            creator,
            description,
            name,
            Some(uri),
            true, // mutate_setting
        );

        move_to(creator, CollectionData {
            name,
            description,
            uri,
            max_supply,
            current_supply: 0,
            mint_start_time,
            mint_price
        });
    }

    public entry fun mint_nft(
        recipient: &signer,
        name: String,
        description: String,
        uri: String,
    ) acquires CollectionData {
        let recipient_addr = signer::address_of(recipient);
        
        // Get collection data
        let collection_data = borrow_global_mut<CollectionData>(@apticity);

        // Verify minting is active
        assert!(timestamp::now_seconds() >= collection_data.mint_start_time, EINVALID_MINT_TIME);
        
        // Verify supply
        assert!(collection_data.current_supply < collection_data.max_supply, ECOLLECTION_NOT_INITIALIZED);

        // Verify payment
        if (collection_data.mint_price > 0) {
            let sender_balance = coin::balance_of<Coin>(recipient, aptos_framework::aptos_coin::APT);
            assert!(sender_balance >= collection_data.mint_price, ENOT_ENOUGH_FUNDS);

            // Transfer mint price
            coin::transfer_from(sender_balance, recipient, aptos_framework::aptos_coin::APT, collection_data.mint_price);
        }

        // Token creation (adjusted code)
        token::mint(
            recipient,
            collection_data.name,
            description,
            name,
            Some(uri),
            vector::empty<String>(), // property_keys
            vector::empty<vector<u8>>(), // property_values
            vector::empty<String>(), // property_types
        );

        // Increment supply
        collection_data.current_supply = collection_data.current_supply + 1;

        // Emit mint event
        event::emit(MintEvent {
            token_id: object::address_from_constructor_ref(&constructor_ref), // Adjus
