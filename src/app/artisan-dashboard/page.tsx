'use client';

import React, { useState } from 'react';
import { 
  Package, 
  DollarSign, 
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Trash2,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  MessageCircle,
  BarChart
} from 'lucide-react';

const ArtisanDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Artisan data
  const artisanData = {
    name: "Marie Uwase",
    email: "marie@example.com",
    avatar: "/images/dia.png",
    specialty: "Basket Weaving",
    rating: 4.8,
    totalProducts: 24,
    totalSales: 156,
    totalRevenue: 3450000,
    pendingOrders: 8
  };

  // Products
  const products = [
    {
      id: 1,
      name: "Traditional Basket",
      category: "Basket",
      price: 25000,
      stock: 15,
      sold: 45,
      revenue: 1125000,
      status: "active",
      image: "/images/wallb.jpeg",
      rating: 4.9
    },
    {
      id: 2,
      name: "Decorative Wall Hanging",
      category: "Wall Arts",
      price: 30000,
      stock: 8,
      sold: 32,
      revenue: 960000,
      status: "active",
      image: "/images/wall.jpeg",
      rating: 4.7
    },
    {
      id: 3,
      name: "Handwoven Mat",
      category: "Basket",
      price: 45000,
      stock: 0,
      sold: 28,
      revenue: 1260000,
      status: "out-of-stock",
      image: "/images/imigongo.jpeg",
      rating: 4.8
    }
  ];

  // Recent orders
  const recentOrders = [
    {
      id: "ORD-101",
      product: "Traditional Basket",
      customer: "Jean Claude",
      amount: 25000,
      quantity: 1,
      status: "pending",
      date: "2025-10-16"
    },
    {
      id: "ORD-102",
      product: "Decorative Wall Hanging",
      customer: "Sarah Mugabo",
      amount: 60000,
      quantity: 2,
      status: "shipped",
      date: "2025-10-15"
    },
    {
      id: "ORD-103",
      product: "Traditional Basket",
      customer: "David Nkusi",
      amount: 25000,
      quantity: 1,
      status: "delivered",
      date: "2025-10-14"
    }
  ];

  // Reviews
  const reviews = [
    {
      id: 1,
      customer: "Jean Claude",
      product: "Traditional Basket",
      rating: 5,
      comment: "Beautiful craftsmanship! Exactly as described.",
      date: "2025-10-15"
    },
    {
      id: 2,
      customer: "Sarah Mugabo",
      product: "Decorative Wall Hanging",
      rating: 4,
      comment: "Great quality, but took longer to arrive than expected.",
      date: "2025-10-14"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Top Navigation */}
      <nav className="bg-[#202f32] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white hover:text-orange-400"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <a href="/">
                <img 
                  src="/images/logo.png"
                  alt="IremeCorner"
                  className="h-10 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </a>
              <span className="text-xl font-semibold hidden sm:inline">Artisan Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative hover:text-orange-400 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {artisanData.pendingOrders}
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={artisanData.avatar}
                  alt={artisanData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline font-medium">{artisanData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg z-40 mt-16 lg:mt-0`}>
          <div className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">My Products</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Orders</span>
              {artisanData.pendingOrders > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {artisanData.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'reviews' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Welcome back, {artisanData.name}!</h2>
                  <p className="text-gray-600">{artisanData.specialty}</p>
                </div>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{artisanData.totalProducts}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Products</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{artisanData.totalSales}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Sales</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{(artisanData.totalRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <p className="text-sm opacity-90">Revenue (Frw)</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{artisanData.rating}</span>
                  </div>
                  <p className="text-sm opacity-90">Average Rating</p>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {products.slice(0, 3).map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.sold} sold</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-orange-500">{product.price.toLocaleString()} Frw</span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                      <div>
                        <p className="font-semibold text-gray-800">{order.product}</p>
                        <p className="text-sm text-gray-600">Order #{order.id} • {order.customer}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{order.amount.toLocaleString()} Frw</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'active' ? 'bg-green-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold">{product.price.toLocaleString()} Frw</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock:</span>
                          <span className={product.stock === 0 ? 'text-red-600 font-semibold' : 'font-semibold'}>{product.stock}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sold:</span>
                          <span className="font-semibold">{product.sold}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-semibold text-green-600">{product.revenue.toLocaleString()} Frw</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.product}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.quantity}</td>
                        <td className="py-3 px-4">{order.amount.toLocaleString()} Frw</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4">
                          {order.status === 'pending' && (
                            <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm transition-colors">
                              Process
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600 fill-current" />
                  <span className="font-bold text-gray-800">{artisanData.rating}</span>
                  <span className="text-gray-600 text-sm">Average Rating</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.customer}</h4>
                        <p className="text-sm text-gray-600">{review.product}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-bold text-gray-800">1,250,000 Frw</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Month</span>
                      <span className="font-bold text-gray-800">980,000 Frw</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth</span>
                      <span className="font-bold text-green-600">+27.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Best Performing Products</h3>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-500">#{index + 1}</span>
                          <span className="text-gray-700">{product.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{product.sold} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Shop Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Shop Name</label>
                    <input 
                      type="text" 
                      defaultValue={artisanData.name + "'s Shop"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Specialty</label>
                    <input 
                      type="text" 
                      defaultValue={artisanData.specialty}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Shop Description</label>
                    <textarea 
                      rows={4}
                      defaultValue="Handcrafted traditional Rwandan products made with love and care."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Add New Product</h3>
              <button 
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                <input 
                  type="text" 
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Basket</option>
                  <option>Wall Arts</option>
                  <option>Pottery</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Price (Frw)</label>
                  <input 
                    type="number" 
                    placeholder="25000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Stock</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;