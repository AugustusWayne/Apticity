import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./walletProvider" // Updated to use your custom wallet hook

interface MintNFTButtonProps {
  imageUrl: string;
}

const MintNFTButton: React.FC<MintNFTButtonProps> = ({ imageUrl }) => {
  const navigate = useNavigate();
  const { walletAddress, connectWallet, walletProvider } = useWallet();

  const handleMint = async () => {
    if (!walletAddress) {
      const availableWallets = ["Petra", "Martian"];
      const chosenWallet = availableWallets[0]; // Default to first available wallet for simplicity
      if (availableWallets.length === 0) {
        alert("No wallet found. Please install a compatible wallet (e.g., Petra or Martian).");
        return;
      }

      // Prompt user to connect wallet
      const confirmed = window.confirm(
        `No wallet connected. Would you like to connect to ${chosenWallet}?`
      );

      if (confirmed) {
        try {
          await connectWallet(chosenWallet);
          alert(`Connected to ${chosenWallet}`);
        } catch (error) {
          alert(`Failed to connect wallet: ${error}`);
          return;
        }
      } else {
        return;
      }
    }

    // Navigate to minting page with the image URL
    console.log("Minting NFT with image:", imageUrl);
    navigate("/minting", { state: { imageUrl } });
  };

  return (
    <button
      onClick={handleMint}
      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all mt-4"
    >
      {walletAddress ? `Mint NFT with ${walletProvider}` : "Connect Wallet & Mint"}
    </button>
  );
};

export default MintNFTButton;
