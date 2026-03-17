'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { Search, ShoppingCart, X, Plus, Minus, CheckCircle } from 'lucide-react';

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
  artisan?: any;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  shippingAddress: string;
  notes: string;
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

  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    shippingAddress: '',
    notes: ''
  });

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
        setProducts(productsArray);
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

  const getProductImage = (product: Product): string => {
    if (product.mainImage) return `http://localhost:5000/${product.mainImage}`;
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return `http://localhost:5000/${product.images[0]}`;
    }
    return '/images/bask.jpeg';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = '/images/bask.jpeg';
  };

  const categoryNames = ['All', ...categories.map(cat => cat.name)];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      matchesCategory = product.category?.name === selectedCategory;
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
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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

  // Checkout handlers
  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCheckoutForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSubmitting(true);

    try {
      // Build order items
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const orderData = {
        items,
        guestName: checkoutForm.guestName,
        guestPhone: checkoutForm.guestPhone,
        guestEmail: checkoutForm.guestEmail || null,
        shippingAddress: checkoutForm.shippingAddress,
        billingAddress: checkoutForm.shippingAddress, // same as shipping
        notes: checkoutForm.notes || null
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        const order = data.data;
        setOrderNumber(order.orderNumber);
        setOrderSuccess(true);

        // Build WhatsApp message
        const itemsList = cart.map(item =>
          `• ${item.name} x${item.quantity} = ${(Number(item.price) * item.quantity).toLocaleString()} Frw`
        ).join('\n');

        const whatsappMessage = 
          `Hello! I just placed an order on IremeCorner 🛍️\n\n` +
          `*Order #${order.orderNumber}*\n\n` +
          `*Items:*\n${itemsList}\n\n` +
          `*Total:* ${cartTotal.toLocaleString()} Frw\n\n` +
          `*My Details:*\n` +
          `Name: ${checkoutForm.guestName}\n` +
          `Phone: ${checkoutForm.guestPhone}\n` +
          `Address: ${checkoutForm.shippingAddress}\n\n` +
          `Please confirm my order. Thank you!`;

        // Get artisan phone from first cart item
        const artisanPhone = cart[0]?.artisan?.phone || '250700000000';
        const cleanPhone = artisanPhone.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

        // Clear cart
        setCart([]);

        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 2000);

      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Please try again.');
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setOrderSuccess(false);
    setCheckoutForm({
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      shippingAddress: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ backgroundImage: "url('/images/wall.jpeg')", opacity: 0.15 }}
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
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                  <div key={item.id} className="border rounded-lg p-4 flex gap-4 bg-black">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm ">{item.name}</h3>
                      <p className="text-orange-500 font-bold">{Number(item.price).toLocaleString()} Frw</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 hover:bg-gray-300 p-1 rounded">
                          <Minus className="w-4 h-4 text-black" />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-200 hover:bg-gray-300 p-1 rounded">
                          <Plus className="w-4 h-4 text-black" />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 hover:text-red-700">
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
                <span className="text-lg font-semibold text-black">Total:</span>
                <span className="text-xl font-bold text-orange-500">{cartTotal.toLocaleString()} Frw</span>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); setShowCheckout(true); }}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* ===== CHECKOUT MODAL ===== */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            {/* Success State */}
            {orderSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                <p className="text-gray-600 mb-2">Your order <span className="font-bold text-orange-500">#{orderNumber}</span> has been received.</p>
                <p className="text-gray-600 mb-6">You will be redirected to WhatsApp to confirm with the artisan...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
                <button
                  onClick={closeCheckout}
                  className="text-sm text-gray-500 underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Checkout Header */}
                <div className="p-6 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                    <p className="text-sm text-gray-500">{cartItemCount} item(s) · {cartTotal.toLocaleString()} Frw</p>
                  </div>
                  <button onClick={closeCheckout} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-medium">{(Number(item.price) * item.quantity).toLocaleString()} Frw</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-orange-500">{cartTotal.toLocaleString()} Frw</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-700">Your Details</h3>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Full Name *</label>
                    <input
                      type="text"
                      name="guestName"
                      value={checkoutForm.guestName}
                      onChange={handleCheckoutFormChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                      disabled={checkoutSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Phone Number *</label>
                    <input
                      type="tel"
                      name="guestPhone"
                      value={checkoutForm.guestPhone}
                      onChange={handleCheckoutFormChange}
                      placeholder="e.g. 0781234567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                      disabled={checkoutSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Email (optional)</label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={checkoutForm.guestEmail}
                      onChange={handleCheckoutFormChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      disabled={checkoutSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Delivery Address *</label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={checkoutForm.shippingAddress}
                      onChange={handleCheckoutFormChange}
                      placeholder="e.g. Kigali, Kimironko, KG 123 St"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                      disabled={checkoutSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={checkoutForm.notes}
                      onChange={handleCheckoutFormChange}
                      placeholder="Any special instructions..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      disabled={checkoutSubmitting}
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    📱 After placing your order, you'll be redirected to WhatsApp to confirm with the artisan directly.
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeCheckout}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                      disabled={checkoutSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      disabled={checkoutSubmitting}
                    >
                      {checkoutSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Placing Order...
                        </span>
                      ) : 'Place Order & Contact Artisan'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
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

            <div className="flex flex-wrap gap-3">
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setDisplayCount(6); }}
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
                        <div className="h-64 overflow-hidden relative">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={handleImageError}
                          />
                          {product.stock === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                          {product.category && (
                            <p className="text-xs text-gray-500 mb-2">Category: {product.category.name}</p>
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