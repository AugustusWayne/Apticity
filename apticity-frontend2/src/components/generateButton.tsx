import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useWallet } from './walletProvider';

// Load Hugging Face API key from environment variable
const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

interface GenerateButtonProps {
  prompt: string;
  onImageGenerated: (imageUrl: string) => void; // Callback to pass image URL to parent
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  prompt,
  onImageGenerated,
}) => {
  const { walletAddress, connectWallet } = useWallet();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoImageUrl = "./images/ai2.webp"; // Path to demo image

  // Function to handle different error types
  const handleError = (error: any) => {
    let errorMessage = "Failed to generate image. Displaying a demo instead.";
    
    if (error?.message) {
      if (error.message.includes("500")) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limit exceeded. Please try again after some time.";
      } else if (error.message.includes("Billing hard limit")) {
        errorMessage = "OpenAI account usage limit reached. Please check your billing settings.";
      }
    }

    setError(errorMessage);
    onImageGenerated(demoImageUrl); // Show demo image in case of error
  };

  const handleGenerateClick = async () => {
    if (!walletAddress) {
      setShowConnectPrompt(true);
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      onImageGenerated(imageUrl); // Pass image URL back to parent
    } catch (err: any) {
      console.error("Generation failed:", err);
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg text-white flex items-center gap-2 ${
          isGenerating ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            GENERATING...
          </>
        ) : (
          "GENERATE"
        )}
      </button>

      {/* Wallet Connection Prompt Modal */}
      {showConnectPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-pink-900/30 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-pink-500 w-6 h-6" />
              <h3 className="text-lg font-semibold">Connect Wallet</h3>
            </div>
            <p className="text-pink-200/70 mb-6">
              Please connect your wallet to generate NFTs.
            </p>
            <div className="space-y-3">
              {window.aptos && (
                <button
                  className="w-full px-4 py-2 bg-pink-950/20 border border-pink-900/30 rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-950/30 transition-colors flex items-center justify-center gap-2"
                  onClick={async () => {
                    try {
                      await connectWallet("Petra");
                      setShowConnectPrompt(false);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <img src="/petra-wallet.png" alt="Petra" className="w-4 h-4" />
                  Connect Petra Wallet
                </button>
              )}
              {window.martian && (
                <button
                  className="w-full px-4 py-2 bg-pink-950/20 border border-pink-900/30 rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-950/30 transition-colors flex items-center justify-center gap-2"
                  onClick={async () => {
                    try {
                      await connectWallet("Martian");
                      setShowConnectPrompt(false);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <img src="/martian-wallet-icon.avif" alt="Martian" className="w-4 h-4" />
                  Connect Martian Wallet
                </button>
              )}
              <button
                className="w-full px-4 py-2 text-pink-200/50 hover:text-pink-200/70 transition-colors"
                onClick={() => setShowConnectPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-red-500 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500 w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Error</h3>
            </div>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
