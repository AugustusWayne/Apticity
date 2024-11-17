import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MintProgressPopup from "./mintProgressPopUp";

export default function MintingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.imageUrl;

  const [isMinting, setIsMinting] = useState(false);

  // Redirect to landing page if no image URL is provided
  if (!imageUrl) {
    navigate("/");
    return null;
  }

  // Simulate minting process
  const handleMint = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // Prevent the form from submitting

    setIsMinting(true);
    // Simulate minting with a delay (you can replace this with your actual minting logic)
    setTimeout(() => {
      setIsMinting(false);
      alert("Minting complete!"); // Replace with actual logic after minting
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle Grid Background for Depth */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#1a1a1a,_transparent_80%)] opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Section */}
      <header className="py-6 px-4 border-b border-pink-900/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
            Mint Your NFT
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm md:text-base bg-pink-950/20 border border-pink-900/30 rounded-lg hover:bg-pink-900/40 transition-all"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-16 px-4 relative z-10">
        <div className="max-w-3xl w-full space-y-12">
          {/* Preview Section */}
          <div className="relative rounded-xl border border-pink-900/30 bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-purple-950/20 p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              Preview Your NFT
            </h2>
            <div className="relative mx-auto w-full max-w-md h-72 md:h-96 rounded-lg overflow-hidden border border-pink-900/30">
              <img
                src={imageUrl}
                alt="Generated NFT"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>

          {/* Token Form */}
          <form onSubmit={handleMint} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                NFT Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white placeholder-pink-200/50 focus:ring focus:ring-pink-500 transition"
                placeholder="Enter the NFT name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white placeholder-pink-200/50 focus:ring focus:ring-pink-500 transition"
                placeholder="Describe your NFT"
                required
              />
            </div>

            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-pink-200/70 mb-2"
              >
                Blockchain Token (Locked)
              </label>
              <input
                type="text"
                id="token"
                className="w-full rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 py-3 text-white cursor-not-allowed"
                value="APT (Aptos)"
                readOnly
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-black font-semibold rounded-lg hover:opacity-90 transition-all"
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : "Mint NFT"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Decorative Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-pink-200/70">
            Powered by AI. Mint your creative ideas in seconds.
          </p>
        </div>
      </footer>

      {/* Minting Progress Popup */}
      {isMinting && <MintProgressPopup onClose={() => setIsMinting(false)} imageUrl={imageUrl} />}
    </div>
  );
}
