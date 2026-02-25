"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DonatePage = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
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
    setShowPaymentInfo(true);
  };

  const handleBackToForm = () => {
    setShowPaymentInfo(false);
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  // Payment Information Component
  if (showPaymentInfo) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
          style={{ 
            backgroundImage: "url('images/wall.jpeg')",
            opacity: 0.5,
          }}
        />
        <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

        <Header />

        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-[#202f32] mb-2">Thank You, {formData.name}!</h1>
              <p className="text-xl text-gray-600">Complete your ${donationAmount} {donationType} donation</p>
            </div>

            {/* Donation Summary */}
            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-orange-800 mb-4">Donation Summary</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">Donor Name:</p>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{formData.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount:</p>
                  <p className="text-2xl font-bold text-">${donationAmount} USD</p>
                </div>
                <div>
                  <p className="font-semibold">Type:</p>
                  <p className="capitalize">{donationType}</p>
                </div>
                {formData.message && (
                  <div className="md:col-span-2">
                    <p className="font-semibold mb-2">Your Message:</p>
                    <p className="italic bg-white p-3 rounded border border-orange-200">"{formData.message}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* Mobile Money */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#202f32]">Mobile Money</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">MTN Mobile Money</p>
                    <p className="text-2xl font-bold text-gray-800">*182*8*1*250785933044#</p>
                    <p className="text-sm text-gray-500 mt-2">Or send to: <strong>0785933044</strong></p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Airtel Money</p>
                    <p className="text-2xl font-bold text-gray-800">*500*1*250790755673#</p>
                    <p className="text-sm text-gray-500 mt-2">Or send to: <strong>0790755673</strong></p>
                  </div>
                </div>

                <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-orange-800 mb-2">Instructions:</p>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Dial the code above or send to the number</li>
                    <li>Enter amount: <strong>${donationAmount}</strong></li>
                    <li>Enter your PIN to confirm</li>
                    <li>You'll receive a confirmation SMS</li>
                  </ol>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-2xl">🏦</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#202f32]">Bank Transfer</h2>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-bold text-gray-800">Bank of Kigali</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="font-bold text-gray-800">IremeCorner Ltd</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-bold text-2xl text-gray-800">00012345678901</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">SWIFT Code</p>
                    <p className="font-bold text-gray-800">BKIGRWRW</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="font-bold text-gray-800">DONATION-{formData.name.replace(/\s+/g, '').toUpperCase()}</p>
                  </div>
                </div>

                <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> Please use the reference number above so we can track your donation.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-[#202f32] to-gray-800 rounded-lg shadow-xl p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="mb-6">Our team is here to assist you with your donation</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://wa.me/250785933044?text=Hello,%20I%20need%20help%20with%20my%20donation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp: +250 785 933 044</span>
                </a>

                <a 
                  href="mailto:iremecorner@gmail.com?subject=Donation%20Inquiry"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email: iremecorner@gmail.com</span>
                </a>
              </div>

              <p className="mt-6 text-sm opacity-90">
                📞 Phone: +250 785 933 044 / +250 790 755 673
              </p>
            </div>

            {/* Back Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleBackToForm}
                className="text-orange-500 hover:text-orange-600 font-semibold underline"
              >
                ← Back to Donation Form
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Main Donation Form
  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ 
          backgroundImage: "url('images/wall.jpeg')",
          opacity: 0.5,
        }}
      />
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  <div className="grid grid-cols-3 gap-2">
                    {['one-time', 'monthly', 'yearly'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDonationType(type)}
                        className={`py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm ${
                          donationType === type
                            ? 'border-orange-300 bg-orange-300 text-white font-semibold'
                            : 'border-gray-300 text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        {type === 'one-time' ? 'One-time' : type === 'monthly' ? 'Monthly' : 'Yearly'}
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
                    <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
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
                    <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
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
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 bg-white"
                      placeholder="Share a message of support..."
                      style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!donationAmount || !formData.name || !formData.email}
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  Donate ${donationAmount || '0'} {donationType === 'yearly' ? 'Per Year' : donationType === 'monthly' ? 'Monthly' : 'Now'}
                </button>
              </form>
            </div>

            {/* Impact Information */}
            <div className="space-y-6">
              {/* Impact Stats */}
              <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <div className="text-gray-800">
                      <p className="font-semibold">$25</p>
                      <p className="text-sm">Provides materials for one artisan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                    <div className="text-gray-800">
                      <p className="font-semibold">$50</p>
                      <p className="text-sm">Funds a youth training session</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div className="text-gray-800">
                      <p className="font-semibold">$100</p>
                      <p className="text-sm">Supports a family for a month</p>
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