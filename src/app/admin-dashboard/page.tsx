'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const stats = {
    totalUsers: 245,
    totalProducts: 1250,
    totalRevenue: 45000000,
    totalOrders: 892,
    activeArtisans: 68,
    pendingApprovals: 12,
    activeCourses: 15,
    completedTrainings: 124
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Marie Uwase',
      product: 'Handmade Basket',
      amount: 25000,
      status: 'completed',
      date: '2025-10-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jean Claude',
      product: 'Imigongo Art',
      amount: 50000,
      status: 'pending',
      date: '2025-10-16'
    },
    {
      id: 'ORD-003',
      customer: 'Sarah Mugabo',
      product: 'Pottery Vase',
      amount: 35000,
      status: 'shipped',
      date: '2025-10-16'
    }
  ];

  const pendingArtisans = [
    {
      id: 1,
      name: 'David Nkusi',
      email: 'david@example.com',
      specialty: 'Pottery',
      joinDate: '2025-10-10',
      products: 5
    },
    {
      id: 2,
      name: 'Grace Uwera',
      email: 'grace@example.com',
      specialty: 'Basket Weaving',
      joinDate: '2025-10-12',
      products: 8
    }
  ];

  const allProducts = [
    {
      id: 1,
      name: 'Traditional Basket',
      artisan: 'Marie Uwase',
      category: 'Basket',
      price: 25000,
      stock: 15,
      status: 'active',
      sales: 45
    },
    {
      id: 2,
      name: 'Imigongo Wall Art',
      artisan: 'Jean Claude',
      category: 'Wall Arts',
      price: 50000,
      stock: 8,
      status: 'active',
      sales: 23
    },
    {
      id: 3,
      name: 'Pottery Vase',
      artisan: 'David Nkusi',
      category: 'Others',
      price: 35000,
      stock: 0,
      status: 'out-of-stock',
      sales: 67
    }
  ];

  const approveArtisan = (id: number) => {
    console.log('Approve artisan:', id);
    // Add approval logic
  };

  const rejectArtisan = (id: number) => {
    console.log('Reject artisan:', id);
    // Add rejection logic
  };

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
              <span className="text-xl font-semibold hidden sm:inline">Admin Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative hover:text-orange-400 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {stats.pendingApprovals}
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center font-bold">
                  A
                </div>
                <span className="hidden md:inline font-medium">Admin</span>
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
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('artisans')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'artisans' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Artisans</span>
              {stats.pendingApprovals > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('trainings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'trainings' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Trainings</span>
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
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <button className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{stats.totalUsers}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Users</p>
                  <p className="text-xs opacity-75 mt-1">+12% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{stats.totalProducts}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Products</p>
                  <p className="text-xs opacity-75 mt-1">+8% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <p className="text-sm opacity-90">Total Revenue (Frw)</p>
                  <p className="text-xs opacity-75 mt-1">+25% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{stats.totalOrders}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Orders</p>
                  <p className="text-xs opacity-75 mt-1">+18% from last month</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">{order.product}</td>
                          <td className="py-3 px-4">{order.amount.toLocaleString()} Frw</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Platform Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Artisans</span>
                      <span className="font-bold text-gray-800">{stats.activeArtisans}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Courses</span>
                      <span className="font-bold text-gray-800">{stats.activeCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Trainings</span>
                      <span className="font-bold text-gray-800">{stats.completedTrainings}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Actions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700">Artisan Approvals</span>
                      <span className="font-bold text-red-600">{stats.pendingApprovals}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-gray-700">Product Reviews</span>
                      <span className="font-bold text-yellow-600">8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Pending Orders</span>
                      <span className="font-bold text-blue-600">15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                  Add New Product
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Artisan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sales</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map(product => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4">{product.artisan}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.price.toLocaleString()} Frw</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">{product.sales}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Artisans Tab */}
          {activeTab === 'artisans' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Artisan Applications</h2>

              {/* Pending Approvals */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h3>
                <div className="space-y-4">
                  {pendingArtisans.map(artisan => (
                    <div key={artisan.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">{artisan.name}</h4>
                        <p className="text-sm text-gray-600">{artisan.email}</p>
                        <p className="text-sm text-gray-600">Specialty: {artisan.specialty}</p>
                        <p className="text-sm text-gray-600">Applied: {artisan.joinDate} • {artisan.products} products</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => approveArtisan(artisan.id)}
                          className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Approve</span>
                        </button>
                        <button 
                          onClick={() => rejectArtisan(artisan.id)}
                          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;