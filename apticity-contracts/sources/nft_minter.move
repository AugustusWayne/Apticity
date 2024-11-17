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
    use aptos_framework::coin;

    /// Custom error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const ECOLLECTION_NOT_INITIALIZED: u64 = 2;
    const EINVALID_MINT_TIME: u64 = 3;
    const ENOT_ENOUGH_FUNDS: u64 = 4;

    /// Struct to store collection data
    struct CollectionData has key {
        /// Name of the collection
        name: String,
        /// Description of the collection
        description: String,
        /// URI for collection metadata
        uri: String,
        /// Maximum supply of NFTs
        max_supply: u64,
        /// Current supply of NFTs
        current_supply: u64,
        /// Mint start time
        mint_start_time: u64,
        /// Mint price in APT
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
    /// @param creator - Signer representing the creator/owner
    /// @param name - Name of the collection
    /// @param description - Description of the collection
    /// @param uri - URI for collection metadata
    /// @param max_supply - Maximum number of NFTs that can be minted
    /// @param mint_start_time - Timestamp when minting can start
    /// @param mint_price - Price in APT to mint one NFT
    public entry fun initialize_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
        mint_start_time: u64,
        mint_price: u64
    ) {
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
    /// @param recipient - Address that will receive the NFT
    /// @param name - Name of the NFT
    /// @param description - Description of the NFT
    /// @param uri - URI for NFT metadata
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

        // Verify payment (if mint price is greater than 0)
        if (collection_data.mint_price > 0) {
            let sender_balance = coin::balance_of<Coin>(recipient, aptos_framework::aptos_coin::APT);
            assert!(sender_balance >= collection_data.mint_price, ENOT_ENOUGH_FUNDS);

            // Transfer mint price (if applicable)
            coin::transfer_from(sender_balance, recipient, aptos_framework::aptos_coin::APT, collection_data.mint_price);
        }

        // Create the token
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

        // Increment supply
        collection_data.current_supply = collection_data.current_supply + 1;

        // Emit mint event
        event::emit(MintEvent {
            token_id: object::address_from_constructor_ref(&constructor_ref),
            creator: @apticity,
            recipient: recipient_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Get collection data
    /// @return CollectionData struct containing collection information
    public fun get_collection_data(): CollectionData acquires CollectionData {
        *borrow_global<CollectionData>(@apticity)
    }

    /// Check if minting is active
    /// @return bool indicating if minting is currently active
    public fun is_minting_active(): bool acquires CollectionData {
        let collection_data = borrow_global<CollectionData>(@apticity);
        timestamp::now_seconds() >= collection_data.mint_start_time &&
            collection_data.current_supply < collection_data.max_supply
    }
}
