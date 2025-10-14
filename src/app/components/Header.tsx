import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-orange-300 italic  Henny Penny">IremeCorner</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search here"
                className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-gray-800  placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
            </div>
          </div>

          {/* Register Button */}
           <a href="/login">
          <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors">
            Register/Login
          </button>
          </a>
        </div>

        {/* Navigation */}
        <nav className="mt-4 ml-200">
          <div className=" bg-opacity-90 rounded-lg px-6 py-3 inline-flex space-x-8">
            <a href="/" className="text-gray-800 hover:text-orange-600 font-medium transition-colors">Home</a>
            <a href="/about" className="text-gray-800 hover:text-orange-600 font-medium transition-colors">About us</a>
            <a href="/shop" className="text-gray-800 hover:text-orange-600 font-medium transition-colors">Shop Now</a>
            <a href="/donate" className="text-gray-800 hover:text-orange-600 font-medium transition-colors">Donate</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;