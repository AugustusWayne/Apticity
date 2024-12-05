import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const MODULE_ADDRESS = "0x640ab888e41dfe3675cfac8fbb663ea8bd35390cb2d12ccba46fbddb89f74122";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export class NFTService {
  private static instance: NFTService;
  private constructor() {}

  public static getInstance(): NFTService {
    if (!NFTService.instance) {
      NFTService.instance = new NFTService();
    }
    return NFTService.instance;
  }

  async getTokenData(tokenId: number) {
    try {
      const response = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::apticity::get_token_data`,
          typeArguments: [],
          functionArguments: [tokenId], // Changed from arguments to functionArguments
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching token data:", error);
      throw error;
    }
  }
}

export default NFTService.getInstance();