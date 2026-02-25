'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { Search, ShoppingCart, X, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  mainImage?: string;
  images?: string[];
  category?: any;
  categoryId?: string;
  description: string;
  stock: number;
  status: string;
}

interface CartItem extends Product {
  quantity: number;
}

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        const productsArray = data.data?.products || [];
        console.log('Products found:', productsArray.length);
        setProducts(productsArray);
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const cats = Array.isArray(data.data)
            ? data.data
            : data.data?.categories || [];
          setCategories(cats);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Get product image - fixed URL builder
 const getProductImage = (product: Product): string => {
  if (product.mainImage) {
    const url = `http://localhost:5000/${product.mainImage}`;
    console.log('Image URL:', url);
    return url;
  }
  return '/images/bask.jpeg';
};

  // Category names for filter buttons
  const categoryNames = ['All', ...categories.map(cat => cat.name)];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const productCategoryName = product.category?.name || '';
      matchesCategory = productCategoryName === selectedCategory;
    }
    return matchesSearch && matchesCategory;
  });

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, filteredProducts.length));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{
          backgroundImage: "url('/images/wall.jpeg')",
          opacity: 0.15
        }}
      />
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed top-24 right-4 bg-orange-300 hover:bg-orange-400 text-white p-4 rounded-full shadow-lg z-40 transition-all transform hover:scale-110"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Shopping Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-[#202f32] text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Shopping Cart ({cartItemCount})</h2>
            <button onClick={() => setIsCartOpen(false)} className="hover:bg-gray-700 p-2 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                    <img
  src={getProductImage(product)}
  alt={product.name}
  crossOrigin="anonymous"
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  onError={(e) => { (e.target as HTMLImageElement).src = '/images/bask.jpeg'; }}
/>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-orange-500 font-bold">{Number(item.price).toLocaleString()} Frw</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-orange-500">
                  {cartTotal.toLocaleString()} Frw
                </span>
              </div>
              <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-semibold transition-colors">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Banner */}
          <section className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg shadow-lg p-8 mb-12 transform hover:scale-[1.02] transition-transform">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop with us</h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Discover authentic Rwandan crafts while supporting local artisans. Every purchase preserves cultural heritage and creates sustainable livelihoods
            </p>
          </section>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-gray-700 font-medium">Search by keyword:</span>
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
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setDisplayCount(6);
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-orange-400 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <section>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No products found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Product Image */}
                        <div className="h-64 overflow-hidden relative group">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/bask.jpeg'; }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />

                          {product.stock === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                          {product.category && (
                            <p className="text-xs text-gray-500 mb-2">
                              Category: {product.category.name}
                            </p>
                          )}

                          <div className="mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              {Number(product.price).toLocaleString()} <span className="text-sm">Frw</span>
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => buyNow(product)}
                              disabled={product.stock === 0}
                              className="flex-1 bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Load More */}
              {hasMore && filteredProducts.length > 0 && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    className="bg-[#202f32] hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    Load More Products ({filteredProducts.length - displayCount} remaining)
                  </button>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <p className="text-center text-gray-600 mt-4">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <WhatsAppFloat />
      <Footer />
    </div>
  );
};

export default ShopPage;