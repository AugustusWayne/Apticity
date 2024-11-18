import LandingPage from "./components/landingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navBar";
import Footer from "./components/footer";
import { WalletProvider } from "./components/walletProvider";
import MintingPage from "./components/mintingPage";

// import { AptosClient } from "aptos";
// export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
// export const client = new AptosClient(NODE_URL);

function App() {
  return (
    <>
    <WalletProvider>
      <Navbar />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/minting" element={<MintingPage />} />
      </Routes>
    </Router>
      <Footer />
      </WalletProvider>
    </>
  );
}

export default App;
