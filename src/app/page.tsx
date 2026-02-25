'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import RecentProducts from './components/RecentProducts';

import WhatsAppFloat from './components/WhatsAppFloat';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Marie Uwase",
      role: "Basket Weaver",
      text: "IremeCorner gave me a platform to reach customers worldwide. My income has tripled!",
      image: "/images/bask.jpeg"
    },
    {
      name: "Jean Claude",
      role: "Pottery Artist",
      text: "The training program helped me blend traditional techniques with modern design.",
      image: "/images/kub.jpeg"
    },
    {
      name: "Sarah Mugabo",
      role: "Customer",
      text: "I love supporting local artisans. The quality and authenticity is unmatched!",
      image: "/images/plant.jpeg"
    }
  ];

  return (
    <div className=" min-h-screen relative overflow-hidden">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

       <Header  />
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center py-20 px-4"
        style={{
          backgroundImage: 'url("/images/backg.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0  bg-opacity-50"></div>
        
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  mb-15 text-center transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            Welcome to IremeCorner
          </h2>

          <p className="text-xl md:text-2xl text-black
           mb-12 max-w-3xl mx-auto">
            Preserving Rwandan heritage through handmade crafts. Empowering artisans, inspiring youth, and connecting tradition with innovation
          </p>
          <p className="text-xl md:text-2xl text-white
           mb-7 max-w-3xl mx-auto"> A creative hub where handmade products meet opportunity</p>



          <div className="flex flex-wrap justify-center gap-10 mt-20 ">
            <a href="/shop">
              <button className="bg-orange-300 hover:bg-black   text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                Shop Now
              </button>
            </a>
            <a href="/login">
              <button className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105">
                Sell with US
              </button>
            </a>
            <a href="/login">
              <button className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                Trainings
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className={`py-16 bg-[#202f32] transition-all duration-1000 transform ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">About us</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <img 
                src="images/bask.jpeg" 
                alt="Handmade crafts" 
                className="w-full h-96 object-cover"
              />
            </div>
            
            <div className="text-white">
              <p className="text-lg leading-relaxed mb-6">
                We help talented artisans and creators showcase their unique crafts, connect with buyers, and grow their businesses. Whether you're looking to buy authentic handmade products, sell your own creations, or learn new skills through our training programs, this is the place for you.
              </p>
              <a href="/about">
                <button className="bg-orange-300 hover:bg-black text-white px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - NEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Artisans</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">200+</div>
              <div className="text-gray-600 font-medium">Products</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Customers</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">30+</div>
              <div className="text-gray-600 font-medium">Trainings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-[#202f32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Our services</h2>

          {/* Marketplace & Sales Platform */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center text-gray-300 bg-gray-700 bg-opacity-70 py-3 rounded-lg mb-8">
              Marketplace & Sales Platform
            </h3>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="images/plant.jpeg" 
                  alt="Marketplace" 
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="text-white">
                <p className="text-lg leading-relaxed">
                  We offer a comprehensive ecosystem designed to empower artisans, engage the youth, and delight customers worldwide
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="text-white order-2 md:order-1">
                <p className="text-lg leading-relaxed">
                  We provide a dedicated online store to showcase and sell your products to a national and international audience. We handle the marketing and e-commerce technology so you can focus on creating.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl order-1 md:order-2 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="images/down.jpeg"  
                  alt="Online store" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="images/wall.jpeg" 
                  alt="Brand building" 
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="text-white">
                <p className="text-lg leading-relaxed">
                  Your story is as valuable as your craft. We feature your profile and creative journey through our blog, social media, and marketing campaigns to build your brand and connect you with your audience.
                </p>
              </div>
            </div>
          </div>

          {/* Training & Workshops */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-center text-gray-300 bg-gray-700 bg-opacity-70 py-3 rounded-lg mb-8">
              Training & Workshops
            </h3>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="images/kub.jpeg" 
                  alt="Training" 
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <div className="text-white">
                <p className="text-lg leading-relaxed">
                  We are committed to conserving our culture by passing it on. We offer free and subsidized training programs for youth in traditional crafts like imigongo art, basket weaving, and pottery, blended with lessons in modern business and design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trainings Offered Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-orange-300 mb-8">
              Trainings Offered
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  title: "Basket Weaving", 
                  desc: "Learn the art of traditional Rwandan basket weaving using local materials.", 
                  image: "/images/wallb.jpeg" 
                },
                { 
                  title: "Imigongo Art", 
                  desc: "Discover the techniques of crafting Imigongo patterns inspired by culture.", 
                  image: "/images/imigongo.jpeg" 
                },
                { 
                  title: "Pottery", 
                  desc: "Master clay shaping and pottery design with expert trainers.", 
                  image: "/images/kub.jpeg" 
                },
                { 
                  title: "Crochet & Yarn Crafts", 
                  desc: "Create stylish crochet items and accessories for daily use.", 
                  image: "/images/croch.jpeg" 
                },
                { 
                  title: "Handmade Jewelries", 
                  desc: "Create stylish items and accessories for daily use.", 
                  image: "/images/udukomo.jpeg" 
                },
                { 
                  title: "Imitako", 
                  desc: "Create stylish crochet items and accessories for daily use.", 
                  image: "/images/wall.jpeg" 
                }
              ].map((training, index) => (
                <div 
                  key={index}
                  className="relative h-80 bg-gray-700 rounded-xl overflow-hidden shadow-lg group transform hover:scale-105 transition-all duration-300"
                >
                  {/* Text content */}
                  <div className="p-6 text-white flex flex-col justify-between h-full z-10 relative">
                    <div>
                      <h4 className="text-xl font-semibold mb-3">{training.title}</h4>
                      <p className="text-sm text-gray-300">{training.desc}</p>
                    </div>
                  </div>

                  {/* Image appears on hover */}
                  <img
                    src={training.image}
                    alt={training.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-500"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>

            <div className='text-center text-white mt-8'>
              <h3 className="text-xl font-semibold mb-4">Want to start learning with Us?</h3>
              <a href="/login">
                <button className="bg-orange-300 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg ">
                  Register here
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <RecentProducts />

      {/* Testimonials Section - NEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">What People Say</h2>
          
          <div className="relative max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeTestimonial === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="bg-[#202f32] rounded-xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-orange-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white text-lg italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === index ? 'bg-orange-400 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - NEW */}
      <section className="py-16 bg-gradient-to-r from-orange-200 to-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Whether you're an artisan or a customer, IremeCorner is your gateway to authentic Rwandan craftsmanship
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/shop">
              <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                Start Shopping
              </button>
            </a>
            <a href="/login">
              <button className="bg-[#202f32] text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                Become a Seller
              </button>
            </a>
          </div>
        </div>
      </section>
       <WhatsAppFloat />

      <Footer />
    </div>
  );
};

export default HomePage;