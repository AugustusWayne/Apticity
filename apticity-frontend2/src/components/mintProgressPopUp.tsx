import React, { useState, useEffect } from "react";

interface MintProgressPopupProps {
  onClose: () => void;
  imageUrl: string; // Dynamic image URL passed from the parent component
}

const MintProgressPopup: React.FC<MintProgressPopupProps> = ({ onClose, imageUrl }) => {
  const [currentStep, setCurrentStep] = useState(1); // Start from step 1
  const steps = [
    { id: 1, label: "Upload images" },
    { id: 2, label: "Upload metadata" },
    { id: 3, label: "Mint" },
  ];

  // Simulate progress by stepping through each phase (for demonstration)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length) {
          return prevStep + 1;
        }
        clearInterval(timer);
        return prevStep;
      });
    }, 2000); // Update every 2 seconds for demo purposes

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50">
      {/* Popup Container */}
      <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-purple-950/20 border border-pink-900/30 rounded-lg shadow-lg text-white">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-pink-200/70 hover:text-white transition"
          onClick={onClose}
        >
          Close ✕
        </button>

        {/* Image Preview */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden border border-pink-900/30">
          <img
            src={imageUrl} // Dynamic image URL
            alt="NFT Preview"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Progress Steps */}
        <div className="text-center mb-4">
          {steps.map((step) => (
            <p
              key={step.id}
              className={`mb-2 text-lg font-semibold ${currentStep >= step.id ? "text-white" : "text-pink-200/50"}`}
            >
              {currentStep === step.id ? "➤" : "○"} {step.label}
            </p>
          ))}
        </div>

        {/* Additional Instructions */}
        <p className="text-sm mt-4 text-pink-200/70 text-center">
          {currentStep === 1
            ? "Uploading images..."
            : currentStep === 2
            ? "Uploading metadata to IPFS..."
            : "Finalizing minting process. Please wait..."}
        </p>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep >= step.id
                  ? "bg-pink-500 scale-125"
                  : "bg-pink-200/30"
              }`}
            />
          ))}
        </div>

        {/* Cancel Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-black font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintProgressPopup;
