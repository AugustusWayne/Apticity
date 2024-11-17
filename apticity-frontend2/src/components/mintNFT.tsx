// MintNFTButton.tsx
import React from "react";

interface MintNFTButtonProps {
  imageUrl: string;
}

const MintNFTButton: React.FC<MintNFTButtonProps> = ({ imageUrl }) => {
  const handleMint = () => {
    console.log("Minting NFT with image:", imageUrl);
    alert("NFT Minting functionality will go here!");
  };

  return (
    <button
      onClick={handleMint}
      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg mt-4"
    >
      Mint NFT
    </button>
  );
};

export default MintNFTButton;
