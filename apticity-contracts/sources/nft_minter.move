module apticity::nft_mint {
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::simple_map::{Self, SimpleMap};

    // ======== Constants ========
    const MAX_SUPPLY: u64 = 10000;
    const MINT_PRICE: u64 = 100;

    // ======== Error Codes ========
    const ERROR_MAX_SUPPLY_REACHED: u64 = 101;
    const ERROR_ALREADY_MINTED: u64 = 102;
    const ERROR_INVALID_TOKEN_ID: u64 = 103;
    const ERROR_NOT_AUTHORIZED: u64 = 104;

    // ======== Core Structures ========
    struct NFTCollection has key {
        token_data: SimpleMap<u64, TokenData>,
        mint_count: u64,
        owner: address
    }

    struct TokenData has store, drop, copy {
        token_id: u64,
        metadata: vector<u8>,
        owner: address,
        mint_time: u64,
        mint_status: MintStatus
    }

    struct MintStatus has store, drop, copy {
        is_revealed: bool,
        is_locked: bool
    }

    // ======== Event Management ========
    struct MintEvents has key {
        mint_started_events: event::EventHandle<MintStartedEvent>,
        mint_completed_events: event::EventHandle<MintCompletedEvent>
    }

    struct MintStartedEvent has drop, store {
        token_id: u64,
        minter: address,
        timestamp: u64
    }

    struct MintCompletedEvent has drop, store {
        token_id: u64,
        owner: address
    }

    // ======== Module Initialization ========
    fun init_module(creator: &signer) {
        let creator_addr = std::signer::address_of(creator);
        
        move_to(creator, NFTCollection {
            token_data: simple_map::create(),
            mint_count: 0,
            owner: creator_addr
        });

        move_to(creator, MintEvents {
            mint_started_events: account::new_event_handle<MintStartedEvent>(creator),
            mint_completed_events: account::new_event_handle<MintCompletedEvent>(creator)
        });
    }

    // ======== Core Minting Logic ========
    public entry fun initiate_mint(
        minter: &signer, 
        metadata: vector<u8>
    ) acquires NFTCollection, MintEvents {
        let collection = borrow_global_mut<NFTCollection>(@apticity);
        let minter_addr = std::signer::address_of(minter);
        
        // Validate mint conditions
        assert!(collection.mint_count < MAX_SUPPLY, ERROR_MAX_SUPPLY_REACHED);
        
        // Create new token
        let new_token = TokenData {
            token_id: collection.mint_count,
            metadata,
            owner: minter_addr,
            mint_time: timestamp::now_microseconds(),
            mint_status: MintStatus {
                is_revealed: false,
                is_locked: false
            }
        };

        // Store token and emit event
        simple_map::add(&mut collection.token_data, collection.mint_count, new_token);
        
        let events = borrow_global_mut<MintEvents>(@apticity);
        event::emit_event(&mut events.mint_started_events, MintStartedEvent {
            token_id: collection.mint_count,
            minter: minter_addr,
            timestamp: timestamp::now_microseconds()
        });

        // Increment mint counter
        collection.mint_count = collection.mint_count + 1;
    }

    public entry fun complete_mint(
        token_id: u64
    ) acquires NFTCollection, MintEvents {
        let collection = borrow_global_mut<NFTCollection>(@apticity);
        
        assert!(simple_map::contains_key(&collection.token_data, &token_id), ERROR_INVALID_TOKEN_ID);
        let token = simple_map::borrow_mut(&mut collection.token_data, &token_id);
        
        assert!(!token.mint_status.is_revealed, ERROR_ALREADY_MINTED);
        
        // Update token status
        token.mint_status.is_revealed = true;
        token.mint_status.is_locked = true;

        // Emit completion event
        let events = borrow_global_mut<MintEvents>(@apticity);
        event::emit_event(&mut events.mint_completed_events, MintCompletedEvent {
            token_id,
            owner: token.owner
        });
    }

    // ======== View Functions ========
    #[view]
    public fun get_token_data(token_id: u64): TokenData acquires NFTCollection {
        let collection = borrow_global<NFTCollection>(@apticity);
        assert!(simple_map::contains_key(&collection.token_data, &token_id), ERROR_INVALID_TOKEN_ID);
        *simple_map::borrow(&collection.token_data, &token_id)
    }

    #[view]
    public fun get_collection_info(): (u64, u64) acquires NFTCollection {
        let collection = borrow_global<NFTCollection>(@apticity);
        (collection.mint_count, MAX_SUPPLY)
    }

    #[view]
    public fun get_minted_tokens(): vector<TokenData> acquires NFTCollection {
        let collection = borrow_global<NFTCollection>(@apticity);
        let tokens = vector::empty<TokenData>();
        let i = 0;
        while (i < collection.mint_count) {
            if (simple_map::contains_key(&collection.token_data, &i)) {
                vector::push_back(&mut tokens, *simple_map::borrow(&collection.token_data, &i));
            };
            i = i + 1;
        };
        tokens
    }
}