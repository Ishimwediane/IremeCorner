'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    artisans: 0,
    products: 0,
    customers: 0,
    trainings: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const increment = {
      artisans: 50 / steps,
      products: 200 / steps,
      customers: 500 / steps,
      trainings: 30 / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounters({
          artisans: Math.floor(increment.artisans * currentStep),
          products: Math.floor(increment.products * currentStep),
          customers: Math.floor(increment.customers * currentStep),
          trainings: Math.floor(increment.trainings * currentStep)
        });
        currentStep++;
      } else {
        setCounters({
          artisans: 50,
          products: 200,
          customers: 500,
          trainings: 30
        });
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

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

      {/* About Us Content */}
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Who we are Section */}
          <section className={`mb-16 bg-[#202f32] rounded-lg shadow-xl p-8 md:p-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-8">Who we are</h2>
            
            <div className="text-white text-lg leading-relaxed space-y-4">
              <p>
                In the vibrant hills of Rwanda, a rich tapestry of handmade crafts tells the story of our people. Yet, we saw the threads of this tapestry beginning to fray. Our master artisans struggled to find markets, and our youth disconnected from these ancestral skills. We founded <span className="text-orange-300 font-semibold">IremeCorner</span> as a bridge connecting the profound skill of our past with the dynamic innovation of our future.
              </p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { src: 'images/imigongo.jpeg', alt: 'Handmade crafts 1', delay: 'delay-100' },
                { src: 'images/wall.jpeg', alt: 'Handmade crafts 2', delay: 'delay-200' },
                { src: 'images/crocheting.jpeg', alt: 'Handmade crafts 3', delay: 'delay-300' },
                { src: 'images/down.jpeg', alt: 'Handmade crafts 4', delay: 'delay-[400ms]' }
              ].map((img, index) => (
                <div 
                  key={index}
                  className={`rounded-lg overflow-hidden shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${img.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section - NEW */}
          <section className={`mb-16 transition-all duration-1000 transform delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-[#202f32] rounded-lg shadow-xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Our Impact</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                    {counters.artisans}+
                  </div>
                  <div className="text-white text-lg">Artisans Supported</div>
                </div>
                
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                    {counters.products}+
                  </div>
                  <div className="text-white text-lg">Products Listed</div>
                </div>
                
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                    {counters.customers}+
                  </div>
                  <div className="text-white text-lg">Happy Customers</div>
                </div>
                
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                    {counters.trainings}+
                  </div>
                  <div className="text-white text-lg">Training Sessions</div>
                </div>
              </div>
            </div>
          </section>

          {/* Our mission Section */}
          <section className={`mb-16 transition-all duration-1000 transform delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#202f32] rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-orange-300 mb-6">Our mission</h2>
                <p className="text-white text-lg leading-relaxed">
                  To empower Rwandan artisans by providing a platform for sustainable income, preserving cultural heritage through the promotion of traditional crafts, and inspiring the next generation by training youth in both craft-making and entrepreneurship, ensuring our culture's legacy "empowering skill and innovation."
                </p>
              </div>

              <div className="rounded-full overflow-hidden shadow-xl w-64 h-64 mx-auto transform hover:scale-105 hover:rotate-3 transition-all duration-500">
                <img 
                  src="images/afri.jpeg" 
                  alt="Traditional food display" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Our Vision Section */}
          <section className={`mb-16 transition-all duration-1000 transform delay-[400ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-full overflow-hidden shadow-xl w-64 h-64 mx-auto order-2 md:order-1 transform hover:scale-105 hover:-rotate-3 transition-all duration-500">
                <img 
                  src="images/frame.jpeg" 
                  alt="Traditional baskets" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-[#202f32] rounded-lg shadow-xl p-8 order-1 md:order-2 hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-orange-300 mb-6">Our Vision</h2>
                <p className="text-white text-lg leading-relaxed">
                  To be Rwanda's landmark platform connecting national identity to authentic crafts, blending timeless artisan techniques with dynamic e-commerce tools, while inspiring a new generation in ancient crafts and modern economy in Rwanda.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values Section - NEW */}
          <section className={`mb-16 transition-all duration-1000 transform delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Our Values</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#202f32] rounded-lg shadow-xl p-6 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                <div className="text-orange-400 text-4xl mb-4 text-center">🎨</div>
                <h3 className="text-xl font-bold text-orange-300 mb-3 text-center">Authenticity</h3>
                <p className="text-white text-center">
                  Every product tells a story of genuine Rwandan craftsmanship and cultural heritage.
                </p>
              </div>

              <div className="bg-[#202f32] rounded-lg shadow-xl p-6 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 delay-100">
                <div className="text-orange-400 text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-xl font-bold text-orange-300 mb-3 text-center">Community</h3>
                <p className="text-white text-center">
                  Building bridges between artisans, customers, and the next generation of creators.
                </p>
              </div>

              <div className="bg-[#202f32] rounded-lg shadow-xl p-6 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 delay-200">
                <div className="text-orange-400 text-4xl mb-4 text-center">💡</div>
                <h3 className="text-xl font-bold text-orange-300 mb-3 text-center">Innovation</h3>
                <p className="text-white text-center">
                  Merging traditional techniques with modern technology to reach global markets.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Team Section */}
          <section className={`mb-16 transition-all duration-1000 transform delay-[600ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Meet the Team</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Team Member 1 */}
              <div className="text-center group">
                <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img 
                    src="/images/dia.png"
                    alt="Diane CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-400 transition-colors">Diane Ishimwe</h3>
                <p className="text-gray-600 mt-1">Co-Founder & CEO</p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center group">
                <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <img 
                    src="/images/yv.jpg"
                    alt="Yvette" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-400 transition-colors">Yvette Kazeneza</h3>
                <p className="text-gray-600 mt-1">Co-Founder & Operations</p>
              </div>
            </div>
          </section>

          {/* Call to Action Section - NEW */}
          <section className={`mb-16 transition-all duration-1000 transform delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-[#202f32] rounded-lg shadow-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-orange-300 mb-4">Join Our Journey</h2>
              <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                Whether you're an artisan looking to showcase your work, a customer seeking authentic handmade products, or someone passionate about preserving cultural heritage, there's a place for you at IremeCorner.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/shop">
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Shop Now
                  </button>
                </a>
                <a href="/login">
                  <button className="bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Become an Artisan
                  </button>
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;