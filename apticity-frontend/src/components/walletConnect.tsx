import React, { useState, useEffect } from "react";

declare global {
    interface Window {
        aptos?: any; // Petra Wallet
        martian?: any; // Martian Wallet
    }
}

const WalletConnect = () => {
    const [wallet, setWallet] = useState<string | null>(null);
    const [walletProvider, setWalletProvider] = useState<string | null>(null);

    // Check which wallets are available
    useEffect(() => {
        if (window.aptos) {
            setWalletProvider("Petra");
        } else if (window.martian) {
            setWalletProvider("Martian");
        } else {
            setWalletProvider(null);
        }
    }, []);

    // Connect to the selected wallet
    const connectWallet = async () => {
        try {
            let response;
            if (walletProvider === "Petra" && window.aptos) {
                response = await window.aptos.connect();
            } else if (walletProvider === "Martian" && window.martian) {
                response = await window.martian.connect();
            } else {
                alert("No supported wallet found!");
                return;
            }

            setWallet(response.address);
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };

    return (
        <div>
            {wallet ? (
                <p>Connected Wallet: {wallet}</p>
            ) : walletProvider ? (
                <button onClick={connectWallet}>
                    Connect {walletProvider} Wallet
                </button>
            ) : (
                <p>No supported wallet found. Please install Petra or Martian Wallet.</p>
            )}
        </div>
    );
};

export default WalletConnect;
