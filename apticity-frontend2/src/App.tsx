import LandingPage from "./components/landingPage";
import { Navbar } from "./components/navBar";
import Footer from "./components/footer";
import { WalletProvider } from "./components/walletProvider";

function App() {
  return (
    <>
    <WalletProvider>
      <Navbar />
      <LandingPage />
      <Footer />
      </WalletProvider>
    </>
  );
}

export default App;
