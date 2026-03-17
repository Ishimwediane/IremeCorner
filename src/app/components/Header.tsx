'use client';

import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const handleSearch = (e) => {
  if (e.key === "Enter" && searchQuery.trim() !== "") {
    router.push(`/search?q=${searchQuery}`);
  }
};

  return (
    <header className="relative bg-[#202f32] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-top">
            <a href="/" className="flex items-center">
              <img
                alt="IREME LOGO"
                width="100"
                height="40"
                decoding="async"
                data-nimg="1"
                className="h-20 w-auto object-contain"
                style={{ color: "transparent" }}
                src="images/log2.png"
              />
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
             <input
             type="text"
             placeholder="Search here"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onKeyDown={handleSearch}
             className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-gray-800 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
/>
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
            </div>
          </div>

          {/* Register Button + Hamburger */}
          <div className="flex items-center gap-3">
            <a href="/login">
              <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors">
                Register/Login
              </button>
            </a>

            {/* Hamburger icon - only on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-orange-300 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation - unchanged */}
        <nav className="mt-4 ml-150 hidden lg:block">
          <div className="bg-opacity-90 rounded-lg px-6 py-3 inline-flex space-x-8">
            <a href="/" className="text-white hover:text-orange-200 font-medium transition-colors">Home</a>
            <a href="/about" className="text-white hover:text-orange-200 font-medium transition-colors">About us</a>
            <a href="/shop" className="text-white hover:text-orange-200 font-medium transition-colors">Shop Now</a>
            <a href="/community" className="text-white hover:text-orange-200 font-medium transition-colors">Community</a>
            <a href="/donate" className="text-white hover:text-orange-200 font-medium transition-colors">Donate</a>
            <a href="/contact" className="text-white hover:text-orange-200 font-medium transition-colors">Contact Us</a>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1a2729] border-t border-white border-opacity-10">
          <nav className="flex flex-col px-4 py-3 space-y-1">
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">Home</a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">About us</a>
            <a href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">Shop Now</a>
            <a href="/community" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">Community</a>
            <a href="/donate" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">Donate</a>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-300 hover:bg-white hover:bg-opacity-10 font-medium transition-colors py-3 px-3 rounded-lg">Contact Us</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;