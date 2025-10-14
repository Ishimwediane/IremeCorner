import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="/shop" className="text-gray-300 hover:text-orange-400 transition-colors">Shop Now</a></li>
              <li><a href="/sell" className="text-gray-300 hover:text-orange-400 transition-colors">Sell with us</a></li>
              <li><a href="/trainings" className="text-gray-300 hover:text-orange-400 transition-colors">Trainings</a></li>
              
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contacts</h4>
            <div className="space-y-2 text-gray-300">
              <p>Phone: +250785933044</p>
              <p>+250790755673</p>
              <p>Email: iremecorner@gmail.com</p>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>All Rights Reserved. IremeCorner © 2025 Store.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;