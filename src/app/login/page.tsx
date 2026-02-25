'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '' ,
    email: '',
    password: '',
    confirmPassword: '',
    role: 'artisan', // Only artisan or admin
    phone: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Get the nested user object
      const user = data.data?.user;

      if (!user) {
        alert('Login failed: User not found');
        setLoading(false);
        return;
      }

      // Store accessToken and user in localStorage
      localStorage.setItem('authToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/artisan-dashboard';
      }
    } else {
      alert(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ First validate passwords on frontend
  if (registerData.password !== registerData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // ✅ Only send fields backend expects (+ phone)
    const { firstName, lastName, email, password, role, phone } = registerData;

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role,
        phone, // ✅ include phone number
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    console.log("Registration success:", data);

    alert("Registration successful! You can now log in.");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong. Try again later.");
  }
};

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

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
      <div className="fixed inset-0 bg-gray-100 -z-10" style={{ opacity: 0.85 }} />

      <Header />

      {/* Main Content */}
      <main className="py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Collaborate with Ireme Corner
          </h1>

          {/* Animated Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden h-[600px] grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column - Forms */}
            <div className="relative overflow-hidden">
              
              {/* Login Form */}
              <div 
                className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                <p className="text-gray-600 mb-8">Login to your account</p>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C39766] hover:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center mt-4">
                    <a href="#" className="text-[#C39766] hover:text-orange-600 text-sm">
                      Forgot Password?
                    </a>
                  </div>
                </form>
              </div>

              {/* Register Form */}
              <div 
                className={`absolute inset-0 p-8 md:p-4 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  !isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
              >
               
                <p className="text-3xl font-bold text-gray-800 mb-2">Register to get started</p>

                <form onSubmit={handleRegisterSubmit} className="space-y-1">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Register As
                    </label>
                    <select
                      name="role"
                      value={registerData.role}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="artisan">Artisan (Seller)</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password (min. 6 characters)"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="w-80 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C39766] hover:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Sliding Message Panel */}
            <div className="relative overflow-hidden">
              
              {/* Message for Login Mode */}
              <div 
                className={`absolute inset-0 bg-[#202f32] text-white p-8 md:p-12 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
                  isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">New Here?</h2>
                <p className="text-lg mb-8 opacity-90 text-center">
                  Sign up and discover a great community of artisans and unique handmade products!
                </p>
                <button
                  onClick={toggleMode}
                  className="bg-[#C39766] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors shadow-lg"
                >
                  Register Now
                </button>
              </div>

              {/* Message for Register Mode */}
              <div 
                className={`absolute inset-0 bg-[#202f32] text-white p-8 md:p-12 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
                  !isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Already Registered?</h2>
                <p className="text-lg mb-8 opacity-90 text-center">
                  Login to access your account and continue your journey with IremeCorner!
                </p>
                <button
                  onClick={toggleMode}
                  className="bg-[#C39766] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-300 transition-colors shadow-lg"
                >
                  Login
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;