export default function Footer() {
  return (
    <footer className="border-t border-pink-900/30 bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section */}
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/ApticityLogo.png" 
            alt="Apticity Logo" 
            className="h-8 w-auto"
          />
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
            Apticity
          </span>
        </div>

        <p className="text-center text-pink-200/70 text-sm">
          Generate and mint unique NFTs powered by artificial intelligence
        </p>

        {/* Quick Links */}
        <div className="mt-6 flex justify-center">
          <ul className="flex space-x-8 text-sm">
            <li>
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                Generate
              </a>
            </li>
            <li>
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                My NFTs
              </a>
            </li>
            <li>
              <a href="#" className="text-pink-200/70 hover:text-white transition-colors">
                Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 text-center">
          <p className="text-sm text-pink-200/50">
            © {new Date().getFullYear()} Apticity. All rights reserved.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-6 flex justify-center space-x-4">
          <div className="h-px w-16 bg-gradient-to-r from-pink-500 to-orange-500" />
          <div className="h-px w-16 bg-gradient-to-r from-orange-500 to-pink-500" />
        </div>
      </div>
    </footer>
  );
}