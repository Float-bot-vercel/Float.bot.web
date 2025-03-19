import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#202225] border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-[#5865F2] text-2xl font-bold">Float</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#features" className="border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2] px-1 pt-1 inline-flex items-center text-sm font-medium">
                Features
              </a>
              <a href="#commands" className="border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2] px-1 pt-1 inline-flex items-center text-sm font-medium">
                Commands
              </a>
              <a href="#games" className="border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2] px-1 pt-1 inline-flex items-center text-sm font-medium">
                Games
              </a>
              <a href="#faq" className="border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2] px-1 pt-1 inline-flex items-center text-sm font-medium">
                FAQ
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <a href="#invite" className="bg-[#5865F2] hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add to Discord
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden ml-4">
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={toggleMobileMenu}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <a
            href="#features"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#commands"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Commands
          </a>
          <a
            href="#games"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Games
          </a>
          <a
            href="#faq"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-[#B9BBBE] hover:text-white hover:border-[#5865F2]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FAQ
          </a>
        </div>
      </div>
    </nav>
  );
}
