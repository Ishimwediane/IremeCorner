'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', registerData);
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
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C39766] hover:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Login
                  </button>

                  <div className="text-center mt-4">
                    <a href="#" className="text-bg-[#C39766] hover:text-orange-600 text-sm">
                      Forgot Password?
                    </a>
                  </div>
                </form>
              </div>

              {/* Register Form */}
              <div 
                className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  !isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6">Register to get started</p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                     <label className="block text-gray-700 mb-2 font-medium">
                     name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    />
                  </div>
                   <label className="block text-gray-700 mb-2 font-medium">
                     Email
                    </label>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                     <label className="block text-gray-700 mb-2 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                     Confirm  Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C39766] hover:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Register
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