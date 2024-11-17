export default function Navbar() {
    return (
      <nav className="border-b border-pink-900/30 bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <img 
                src="/ApticityLogo.png" 
                alt="Apticity Logo" 
                className="h-8 w-auto"
              />
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
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg text-white">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }