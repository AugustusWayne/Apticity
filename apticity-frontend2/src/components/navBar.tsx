import { Wallet, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from "react";
import { useWallet } from './walletProvider';

export function Navbar() {
  const { walletAddress, walletProvider, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletConnect = async (provider: string) => {
    try {
      await connectWallet(provider);
      setShowWalletDropdown(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to connect wallet");
    }
  };

  return (
    <nav className="border-b border-pink-900/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img src="/ApticityLogo.png" alt="Apticity Logo" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
              Apticity
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                Generate
              </a>
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                My NFTs
              </a>
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                Docs
              </a>

              {/* Wallet Connection */}
              {!window.aptos && !window.martian ? (
                <button
                  className="px-4 py-2 bg-pink-950/20 border border-pink-900/30 rounded-lg text-pink-200/70 hover:text-white flex items-center gap-2"
                  onClick={() => window.open('https://petra.app/', '_blank')}
                >
                  <Wallet className="w-4 h-4" />
                  Install Wallet
                  <ExternalLink className="w-3 h-3" />
                </button>
              ) : walletAddress ? (
                <div className="relative group">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg text-white flex items-center gap-2"
                    onClick={disconnectWallet}
                  >
                    <Wallet className="w-4 h-4" />
                    {formatAddress(walletAddress)}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-pink-900/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-2">
                      <p className="text-xs text-pink-200/70">Connected to {walletProvider}</p>
                      <p className="text-xs text-pink-200/50 break-all">{walletAddress}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg text-white flex items-center gap-2"
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    disabled={isConnecting}
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Wallet Dropdown */}
                  {showWalletDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border border-pink-900/30 rounded-lg shadow-xl">
                      <div className="py-1">
                        {window.aptos && (
                          <button
                            className="w-full px-4 py-2 text-left text-pink-200/70 hover:text-white hover:bg-pink-950/20 transition-colors flex items-center gap-2"
                            onClick={() => handleWalletConnect("Petra")}
                          >
                            <img src="/petra-wallet.png" alt="Petra" className="w-4 h-4" />
                            Petra Wallet
                          </button>
                        )}
                        {window.martian && (
                          <button
                            className="w-full px-4 py-2 text-left text-pink-200/70 hover:text-white hover:bg-pink-950/20 transition-colors flex items-center gap-2"
                            onClick={() => handleWalletConnect("Martian")}
                          >
                            <img src="/martian-wallet-icon.avif" alt="Martian" className="w-4 h-4" />
                            Martian Wallet
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
