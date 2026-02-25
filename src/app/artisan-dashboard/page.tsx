'use client';

import React, { useState, useEffect } from 'react';
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
  Star,
  BarChart,
  RefreshCw
} from 'lucide-react';

const ArtisanDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [artisanData, setArtisanData] = useState({
    name: "",
    email: "",
    avatar: "/images/dia.png",
    specialty: "",
    rating: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    price: '',
    stock: '',
    description: '',
    tags: [],
    image: null
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Handle different response formats
          const cats = Array.isArray(data.data) 
            ? data.data 
            : data.data?.categories || [];
          setCategories(cats);
          console.log('Fetched categories:', cats);
          
          // Set default category if none selected
          if (cats.length > 0 && !newProduct.categoryId) {
            setNewProduct(prev => ({
              ...prev,
              categoryId: cats[0].id,
              categoryName: cats[0].name
            }));
          }
        } else {
          console.error('Invalid categories response format:', data);
        }
      } else {
        console.error('Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchProducts();
    fetchOrders();
    fetchReviews();
    fetchCategories();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { 
        window.location.href = '/login'; 
        return; 
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArtisanData({
          name: data.firstName + ' ' + data.lastName || data.name || "Artisan",
          email: data.email || "",
          avatar: data.avatar 
            ? `http://localhost:5000/${data.avatar}` 
            : "/images/dia.png",
          specialty: data.specialty || "Artisan",
          rating: data.rating || 4.8,
          totalProducts: data.totalProducts || 0,
          totalSales: data.totalSales || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.pendingOrders || 0
        });
      } else {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile. Please refresh the page.');
    } finally { 
      setLoading(false); 
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const productsArray = data.data?.products || [];
        console.log('Products found:', productsArray.length);
        setProducts(productsArray);
      } else {
        console.error('Failed to fetch products:', response.status);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (error) { 
      console.error('Error fetching orders:', error); 
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/reviews/my-reviews', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (error) { 
      console.error('Error fetching reviews:', error); 
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.id === value);
      setNewProduct(prev => ({
        ...prev,
        categoryId: value,
        categoryName: selectedCategory ? selectedCategory.name : ''
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setNewProduct(prev => ({ ...prev, image: file }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!newProduct.name.trim()) {
      alert('Product name is required');
      setSubmitting(false);
      return;
    }
    if (!newProduct.categoryId) {
      alert('Please select a category');
      setSubmitting(false);
      return;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      alert('Please enter a valid price');
      setSubmitting(false);
      return;
    }
    if (!newProduct.description.trim()) {
      alert('Product description is required');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Not authenticated. Please login again.');
        window.location.href = '/login';
        return;
      }

      const formData = new FormData();
      formData.append('name', newProduct.name.trim());
      formData.append('description', newProduct.description.trim());
      formData.append('price', newProduct.price);
      formData.append('categoryId', newProduct.categoryId);
      formData.append('stock', newProduct.stock || '0');
      
      if (newProduct.tags && newProduct.tags.length > 0) {
        newProduct.tags.forEach(tag => formData.append('tags', tag));
      }
      
      if (newProduct.image) {
        formData.append('productImages', newProduct.image);
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseData = await response.json();
      
      if (response.ok) {
        alert('Product added successfully!');
        setNewProduct({ 
          name: '', 
          description: '', 
          price: '', 
          categoryId: categories.length > 0 ? categories[0].id : '', 
          categoryName: categories.length > 0 ? categories[0].name : '', 
          stock: '', 
          tags: [], 
          image: null 
        });
        setShowAddProduct(false);
        fetchProducts();
      } else {
        console.error('Backend error:', responseData);
        alert(responseData.message || `Failed to add product. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error adding product:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  // Helper to build image URL
  const getImageUrl = (mainImage) => {
    if (!mainImage) return '/images/placeholder.jpg';
    if (mainImage.startsWith('http')) return mainImage;
    return `http://localhost:5000/${mainImage}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
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
                {artisanData.pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {artisanData.pendingOrders}
                  </span>
                )}
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

      {/* Sidebar */}
      <div className="flex">
        <aside className={`fixed lg:static inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg z-40 mt-16 lg:mt-0`}>
          <div className="p-6 space-y-2">
            {[
              { id: 'overview', icon: TrendingUp, label: 'Overview' },
              { id: 'products', icon: Package, label: 'My Products' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'reviews', icon: Star, label: 'Reviews' },
              { id: 'analytics', icon: BarChart, label: 'Analytics' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {id === 'orders' && artisanData.pendingOrders > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {artisanData.pendingOrders}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-4 border-t">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
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
                  <p className="text-gray-600">{artisanData.email}</p>
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

              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Recent Products</h3>
                  <button 
                    onClick={fetchProducts}
                    className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
                {products.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No products yet. Add your first product!</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {products.slice(0, 3).map(product => (
                      <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={getImageUrl(product.mainImage)}
                          alt={product.name}
                          className="w-full h-40 object-cover"
                          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {product.category?.name || 'Uncategorized'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-orange-500">
                              {Number(product.price).toLocaleString()} Frw
                            </span>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 text-sm">{product.rating || '0.0'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={refreshCategories}
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors text-sm"
                    title="Refresh categories"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden md:inline">Refresh Categories</span>
                  </button>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">No products yet</p>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="relative h-48">
                        <img 
                          src={getImageUrl(product.mainImage)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {product.status || 'active'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-semibold">{Number(product.price).toLocaleString()} Frw</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className={product.stock === 0 ? 'text-red-600 font-semibold' : 'font-semibold'}>
                              {product.stock || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-semibold">
                              {product.category?.name || 'Uncategorized'}
                            </span>
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
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <p>Order #{order.id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <p>Review: {review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-center py-8">Analytics coming soon</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-center py-8">Settings coming soon</p>
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
                disabled={submitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category *</label>
                {categories.length === 0 ? (
                  <div className="text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                      <span>Loading categories...</span>
                    </div>
                    <button 
                      type="button"
                      onClick={refreshCategories}
                      className="mt-2 text-orange-500 hover:text-orange-600 underline text-sm"
                    >
                      Click here if categories don't load
                    </button>
                  </div>
                ) : (
                  <select 
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {newProduct.categoryId && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {categories.find(c => c.id === newProduct.categoryId)?.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Price (Frw) *</label>
                  <input 
                    type="number" 
                    name="price"
                    value={newProduct.price}
                    onChange={handleProductInputChange}
                    placeholder="25000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                    min="1"
                    step="1"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Stock *</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleProductInputChange}
                    placeholder="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                    min="0"
                    step="1"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description *</label>
                <textarea 
                  name="description"
                  value={newProduct.description}
                  onChange={handleProductInputChange}
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={submitting}
                />
                {newProduct.image && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">✓ Image selected: {newProduct.image.name}</p>
                    <img 
                      src={URL.createObjectURL(newProduct.image)} 
                      alt="Preview" 
                      className="mt-2 h-24 w-24 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </span>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;