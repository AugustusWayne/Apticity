import { useState } from "react";
import { useWallet } from './walletProvider';
import { AlertCircle } from 'lucide-react'

// Generate Button Component
export function GenerateButton() {
    const { walletAddress, connectWallet } = useWallet();
    const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  
    const handleGenerateClick = async () => {
      if (!walletAddress) {
        setShowConnectPrompt(true);
        return;
      }
      // Handle generate functionality when wallet is connected
      console.log("Generating with connected wallet:", walletAddress);
    };
  
    return (
      <div className="relative">
        <button
          onClick={handleGenerateClick}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg text-white"
        >
          GENERATE
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
      </div>
    );
  }