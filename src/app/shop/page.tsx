'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search } from 'lucide-react';

// Sample product data
const products = [
  {
    id: 1,
    name: 'Handmade bag decorated with Imigongo',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    category: 'Clothes'
  },
  {
    id: 2,
    name: 'Wall hanging',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
    category: 'Wall Arts'
  },
  {
    id: 3,
    name: 'Imigongo mats',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
    category: 'Basket'
  },
  {
    id: 4,
    name: 'Handmade Portable basket with cover',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop',
    category: 'Basket'
  },
  {
    id: 5,
    name: 'Handmade Crocheted bag',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    category: 'Clothes'
  },
  {
    id: 6,
    name: 'Handmade candles (collection)',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1602874801006-96762a7833e4?w=400&h=400&fit=crop',
    category: 'Others'
  }
];

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Clothes', 'Wall Arts', 'Basket', 'Others'];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative">
      {/* Shared Static Background Image for entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&h=1080&fit=crop')",
          opacity: 0.15
        }}
      />

      {/* Optional overlay for better readability */}
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Banner */}
          <section className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg shadow-lg p-8 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop with us</h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Discover unique handmade products directly from Rwandan villages. Support local makers, buy authentic craftmanship
            </p>
          </section>

          {/* Search and Filter Section */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6 flex items-center">
              <span className="text-gray-700 font-medium mr-4">Search by keyword:</span>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <section>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price and Button */}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-gray-900">
                          {product.price.toLocaleString()} Frw
                        </span>
                        <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
                          Buy now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Load More (Optional) */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More Products
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;