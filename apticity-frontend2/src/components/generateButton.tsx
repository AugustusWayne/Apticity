import { useState } from "react";
import { useWallet } from './walletProvider';
import { AlertCircle, Loader2 } from 'lucide-react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface GenerateButtonProps {
  prompt: string;
  onImageGenerated: (imageUrl: string) => void;
}

export function GenerateButton({ prompt, onImageGenerated }: GenerateButtonProps) {
  const { walletAddress, connectWallet } = useWallet();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // Track if the error modal should be shown

  const handleGenerateClick = async () => {
    if (!walletAddress) {
      setShowConnectPrompt(true);
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      setShowErrorModal(true);
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0]?.url;
      
      if (imageUrl && onImageGenerated) {
        onImageGenerated(imageUrl);
      }
    } catch (err: any) {
      console.error("Generation failed:", err);

      // Handle specific error cases
      let errorMessage = "Failed to generate image. Please try again later.";
      if (err.message?.includes('Billing hard limit')) {
        errorMessage = "OpenAI account has reached its usage limit. Please check your billing settings.";
      } else if (err.status === 400) {
        errorMessage = "Invalid request. Please check your prompt and try again.";
      } else if (err.status === 429) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      }

      setError(errorMessage);
      setShowErrorModal(true); // Show the error modal
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
          isGenerating ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            GENERATING...
          </>
        ) : (
          'GENERATE'
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
                  <img src="/martian-wallet-icon.png" alt="Martian" className="w-4 h-4" />
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

      {/* Error Modal for Image Generation */}
      {showErrorModal && error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-pink-900/30 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500 w-6 h-6" />
              <h3 className="text-lg font-semibold text-red-500">Error</h3>
            </div>
            <p className="text-red-200/70 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 bg-red-950/20 border border-red-900/30 rounded-lg text-red-200/70 hover:text-white hover:bg-red-950/30 transition-colors"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
