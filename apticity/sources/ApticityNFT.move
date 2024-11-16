module Apticity::ApticityNFT {
    use std::string;
    use std::vector;

    struct NFT has key {
        id: u64,
        creator: address,
        uri: vector<u8>,
    }

    public fun mint_nft(account: &signer, uri: vector<u8>): NFT {
        let nft = NFT {
            id: std::account::new_resource_address(account),
            creator: signer::address_of(account),
            uri,
        };
        return nft;
    }
}
