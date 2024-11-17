import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface MintNFTButtonProps {
  imageUrl: string;
}

const MintNFTButton: React.FC<MintNFTButtonProps> = ({ imageUrl }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleMint = () => {
    console.log("Minting NFT with image:", imageUrl);
    // Redirect to the minting page when clicked
    navigate("/minting", { state: { imageUrl } });
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
