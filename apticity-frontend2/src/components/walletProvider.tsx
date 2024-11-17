import { useState, useEffect, createContext, useContext } from "react";

// Type definitions
interface WalletResponse {
  address: string;
}

declare global {
  interface Window {
    aptos?: any;
    martian?: any;
  }
}

// Create wallet context
interface WalletContextType {
  walletAddress: string | null;
  walletProvider: string | null;
  isConnecting: boolean;
  availableWallets: string[]; // To store detected wallets
  connectWallet: (provider: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Wallet Provider Component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);

  // Check for existing connections and detect available wallets on mount
  useEffect(() => {
    const checkAvailableWallets = async () => {
      const detectedWallets: string[] = [];
      if (window.aptos) {
        detectedWallets.push("Petra");
        try {
          const account = await window.aptos.account();
          if (account) {
            setWalletAddress(account.address);
            setWalletProvider("Petra");
          }
        } catch {
          console.log("No active connection to Petra.");
        }
      }

      if (window.martian) {
        detectedWallets.push("Martian");
        try {
          const account = await window.martian.account();
          if (account) {
            setWalletAddress(account.address);
            setWalletProvider("Martian");
          }
        } catch {
          console.log("No active connection to Martian.");
        }
      }

      setAvailableWallets(detectedWallets);
    };

    checkAvailableWallets();
  }, []);

  const connectWallet = async (provider: string) => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      let response: WalletResponse;

      if (provider === "Petra" && window.aptos) {
        response = await window.aptos.connect();
        setWalletAddress(response.address);
        setWalletProvider("Petra");
      } else if (provider === "Martian" && window.martian) {
        response = await window.martian.connect();
        setWalletAddress(response.address);
        setWalletProvider("Martian");
      } else {
        throw new Error(`${provider} wallet not found! Please install it first.`);
      }
    } catch (error: any) {
      console.error("Wallet connection failed:", error.message || error);
      alert(`Wallet connection failed: ${error.message || "Unknown error occurred."}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletProvider === "Petra" && window.aptos) {
        await window.aptos.disconnect();
      } else if (walletProvider === "Martian" && window.martian) {
        await window.martian.disconnect();
      }
      setWalletAddress(null);
      setWalletProvider(null);
    } catch (error: any) {
      console.error("Wallet disconnection failed:", error.message || error);
      alert(`Wallet disconnection failed: ${error.message || "Unknown error occurred."}`);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletProvider,
        isConnecting,
        availableWallets,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook for using wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};