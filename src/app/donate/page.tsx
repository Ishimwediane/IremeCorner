"use client"; // Add this at the very top

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DonatePage = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setDonationAmount(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle donation submission here
    alert(`Thank you for your ${donationType} donation of $${donationAmount}! We appreciate your support.`);
    // Reset form
    setDonationAmount('');
    setSelectedAmount('');
    setFormData({ name: '', email: '', message: '' });
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen relative">
      {/* Shared Static Background Image for entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ 
          backgroundImage: "url('images/wall.jpeg')",
          opacity: 0.5,
        }}
      />

      {/* Optional overlay for better readability */}
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      {/* Donation Content */}
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#202f32] mb-4">
              Support Our Artisans
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your donation helps preserve Rwandan cultural heritage and empowers local artisans with sustainable livelihoods.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Donation Form */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-[#202f32] mb-6">Make a Donation</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Donation Type */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">Donation Type</label>
                  <div className="flex space-x-4">
                    {['one-time', 'monthly'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDonationType(type)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                          donationType === type
                            ? 'border-orange-030 bg-orange-50 text-orange-500 font-semibold'
                            : 'border-gray-300 text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        {type === 'one-time' ? 'One-time' : 'Monthly'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">Select Amount (USD)</label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount.toString())}
                        className={`py-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedAmount === amount.toString()
                            ? 'border-orange-500 bg-orange-500 text-white font-semibold'
                            : 'border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAmountSelect('other')}
                      className={`py-3 rounded-lg border-2 transition-all duration-300 col-span-3 ${
                        selectedAmount === 'other'
                          ? 'border-orange-500 bg-orange-500 text-white font-semibold'
                          : 'border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      Other Amount
                    </button>
                  </div>

                  {/* Custom Amount Input */}
                  {(selectedAmount === 'other' || !quickAmounts.includes(parseInt(donationAmount))) && (
                    <div className="mt-4">
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        min="1"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      placeholder="Share a message of support..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!donationAmount || !formData.name || !formData.email}
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  Donate ${donationAmount || '0'} {donationType === 'monthly' ? 'Monthly' : 'Now'}
                </button>
              </form>
            </div>

            {/* Impact Information */}
            <div className="space-y-6">
              {/* Impact Stats */}
              <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <div>
                      <p className="font-semibold">$25</p>
                      <p className="text-sm opacity-90">Provides materials for one artisan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                    <div>
                      <p className="font-semibold">$50</p>
                      <p className="text-sm opacity-90">Funds a youth training session</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div>
                      <p className="font-semibold">$100</p>
                      <p className="text-sm opacity-90">Supports a family for a month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Donate */}
              <div className="bg-[#202f32] rounded-lg shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-orange-300 mb-4">Why Donate?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-300 mt-1">✓</span>
                    <span>Preserve traditional Rwandan crafts</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-300 mt-1">✓</span>
                    <span>Empower local artisans with fair income</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-300 mt-1">✓</span>
                    <span>Train youth in ancestral skills</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-300 mt-1">✓</span>
                    <span>Support sustainable community development</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-300 mt-1">✓</span>
                    <span>Keep cultural heritage alive for future generations</span>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 text-lg">🙏</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Jean Paul</h4>
                    <p className="text-sm text-gray-600">Monthly Supporter</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Knowing my donation helps preserve our Rwandan heritage while supporting talented artisans brings me joy every month. IremeCorner is doing incredible work!"
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-br from-[#202f32] to-gray-800 rounded-lg shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4">Other Ways to Support</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4">
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🛍️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Shop Our Crafts</h3>
                  <p className="text-sm opacity-90">Purchase authentic handmade products directly from our artisans</p>
                </div>
                <div className="p-4">
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📢</span>
                  </div>
                  <h3 className="font-semibold mb-2">Spread the Word</h3>
                  <p className="text-sm opacity-90">Share our mission with friends and on social media</p>
                </div>
                <div className="p-4">
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold mb-2">Become a Partner</h3>
                  <p className="text-sm opacity-90">Explore corporate partnerships and collaborations</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;