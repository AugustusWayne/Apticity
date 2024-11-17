module apticity::nft_minter {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::coin::{self, Coin};

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

    /// Initialize collection - can only be called once by contract owner
    public entry fun initialize_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
        mint_start_time: u64,
        mint_price: u64
    ) {
        // Ensure collection is not initialized twice
        assert!(borrow_global<Option<CollectionData>>(@my_addr) == None, ECOLLECTION_NOT_INITIALIZED);

        // Create a new collection
        collection::create_unlimited_collection(
            creator,
            description,
            name,
            Some(uri),
            true, // mutate_setting
        );

        // Store collection data
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

    /// Mint a new NFT
    public entry fun mint_nft(
        recipient: &signer,
        name: String,
        description: String,
        uri: String,
    ) acquires CollectionData {
        let recipient_addr = signer::address_of(recipient);
        
        // Retrieve collection data
        let collection_data = borrow_global_mut<CollectionData>(@my_addr);

        // Verify minting is active
        assert!(timestamp::now_seconds() >= collection_data.mint_start_time, EINVALID_MINT_TIME);
        
        // Verify that supply hasn't exceeded max supply
        assert!(collection_data.current_supply < collection_data.max_supply, ECOLLECTION_NOT_INITIALIZED);

        // Check if the minting price is greater than 0 and handle payment logic
        if (collection_data.mint_price > 0) {
            let mint_price = collection_data.mint_price;
            let sender_balance = coin::balance_of<Coin>(recipient, aptos_framework::aptos_coin::APT);
            assert!(sender_balance >= mint_price, ENOT_ENOUGH_FUNDS);

            // Transfer the minting fee
            coin::transfer_from(sender_balance, recipient, aptos_framework::aptos_coin::APT, mint_price);
        }

        // Mint the NFT by creating a token object
        let constructor_ref = token::create_from_account(
            recipient,
            collection_data.name,
            description,
            name,
            Some(uri),
            vector::empty<String>(), // property_keys
            vector::empty<vector<u8>>(), // property_values
            vector::empty<String>(), // property_types
        );

        // Increment the supply count
        collection_data.current_supply = collection_data.current_supply + 1;

        // Emit minting event
        event::emit(MintEvent {
            token_id: object::address_from_constructor_ref(&constructor_ref),
            creator: @my_addr,
            recipient: recipient_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Get collection data
    public fun get_collection_data(): CollectionData acquires CollectionData {
        *borrow_global<CollectionData>(@my_addr)
    }

    /// Check if minting is active
    public fun is_minting_active(): bool acquires CollectionData {
        let collection_data = borrow_global<CollectionData>(@my_addr);
        timestamp::now_seconds() >= collection_data.mint_start_time &&
            collection_data.current_supply < collection_data.max_supply
    }
}
