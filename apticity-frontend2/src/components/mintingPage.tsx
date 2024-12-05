import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "./walletProvider";
import MintProgressPopup from "./mintProgressPopUp";
import { NFTService } from "../services/nftService";
import { AccountAddress } from "@aptos-labs/ts-sdk";

const MODULE_ADDRESS = "0x640ab888e41dfe3675cfac8fbb663ea8bd35390cb2d12ccba46fbddb89f74122";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export default function MintingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { walletAddress, connectWallet, walletProvider, signAndSubmitTransaction } = useWallet();
  const imageUrl = location.state?.imageUrl;

  const [isMinting, setIsMinting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  if (!imageUrl) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMint = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!walletAddress) {
      const confirmed = window.confirm(
        "No wallet connected. Would you like to connect your wallet now?"
      );
      if (confirmed) {
        try {
          await connectWallet(walletProvider || "Petra");
        } catch (err) {
          setError("Failed to connect wallet: " + (err instanceof Error ? err.message : "Unknown error"));
          return;
        }
      } else {
        return;
      }
    }

    const metadata: NFTMetadata = {
      name: formData.name,
      description: formData.description,
      image: imageUrl,
    };

    setIsMinting(true);
    setCurrentStep(1);

    try {
      await signAndSubmitTransaction({
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::apticity::mint_nft`,
        type_arguments: [],
        arguments: [metadata.name, metadata.description, metadata.image]
      });
      
      setCurrentStep(2);
      setCurrentStep(3);

      // Navigate to success page
      setTimeout(() => {
        setIsMinting(false);
        navigate("/nft-success", { 
          state: { 
            metadata
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error minting NFT");
      setIsMinting(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Rest of the JSX remains the same */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#1a1a1a,_transparent_80%)] opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <header className="py-6 px-4 border-b border-pink-900/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
            Mint Your NFT
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm md:text-base bg-pink-950/20 border border-pink-900/30 rounded-lg hover:bg-pink-900/40 transition-all"
          >
            Back to Home
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center py-16 px-4 relative z-10">
        <div className="max-w-3xl w-full space-y-12">
          <div className="relative rounded-xl border border-pink-900/30 bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-purple-950/20 p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              Preview Your NFT
            </h2>
            <div className="relative mx-auto w-full max-w-md h-72 md:h-96 rounded-lg overflow-hidden border border-pink-900/30">
              <img
                src={imageUrl}
                alt="Generated NFT"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>

          <form onSubmit={handleMint} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                NFT Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white placeholder-pink-200/50 focus:ring focus:ring-pink-500 transition"
                placeholder="Enter the NFT name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white placeholder-pink-200/50 focus:ring focus:ring-pink-500 transition"
                placeholder="Describe your NFT"
                required
              />
            </div>

            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                Blockchain Token (Locked)
              </label>
              <input
                type="text"
                id="token"
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white cursor-not-allowed"
                value="APT (Aptos)"
                readOnly
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-black font-semibold rounded-lg hover:opacity-90 transition-all"
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : "Mint NFT"}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </form>
        </div>
      </main>

      <footer className="py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-pink-200/70">
            Powered by AI. Mint your creative ideas in seconds.
          </p>
        </div>
      </footer>

      {isMinting && (
        <MintProgressPopup
          onClose={() => {
            setIsMinting(false);
            setCurrentStep(0);
            setError(null);
          }}
          imageUrl={imageUrl}
          currentStep={currentStep}
          error={error}
        />
      )}
    </div>
  );
}