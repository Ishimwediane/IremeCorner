import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';



const HomePage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Shared Static Background Image for entire page */}
      <div 
        className=" inset-0 bg-cover bg-center bg-fixed -z-50"
        style={{ 
          backgroundImage: "url('/images/wallb.jpeg')",
          opacity: 0.15
        }}
      />

      {/* Optional overlay for better readability */}
      <div className="fixed inset-0 bg-white -z-10 " style={{ opacity:0.7}} />

      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4"
  style={{
    backgroundImage: 'url("/images/wallb.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.5)',
  }}
>
  
  <div className="relative  max-w-6xl mx-auto">
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center ">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700  max-w-xl">
            Welcome on IremeCorner  a creative hub where handmade products meet opportunity.
          </h2>

          <div className="flex flex-wrap ml-10 gap-50 mt-80">
            <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-8 py-3 rounded-md font-medium transition-colors">
              Shop Now
            </button>
            <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-8 py-3 rounded-md font-medium transition-colors">
              Sell with US
            </button>
            <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-8 py-3 rounded-md font-medium transition-colors">
              Trainings
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-[#202f32] mt-10 h-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">About us</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                  src="images\bask.jpeg" 
                  alt="Handmade bracelets" 
                  className="w-80 h-70 object-cover"
                />
            </div>
            
            <div className="text-white">
              <p className="text-lg leading-relaxed mb-6">
                We help talented artisans and creators showcase their unique crafts, connect with buyers, and grow their businesses. Whether you're looking to buy authentic handmade products, sell your own creations, or learn new skills through our training programs, this is the place for you.
              </p>
              <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors">
                More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-[#202f32] mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Our services</h2>

          {/* Marketplace & Sales Platform */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-center text-gray-300 bg-gray-700 bg-opacity-70 py-3 rounded-lg mb-8">
              Marketplace & Sales Platform
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                  src="images\plant.jpeg" 
                  alt="Handmade bracelets" 
                  className="w-full h-100 object-cover"
                />
            </div>
            
            <p className="text-white text-center text-lg mb-8 max-w-3xl mx-auto">
              We offer a comprehensive ecosystem designed to empower artisans, engage the youth, and delight customers worldwide
            </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
             
              <div className="text-white">
                <p className="text-lg leading-relaxed">
                  We provide a dedicated online store to showcase and sell your products to a national and international audience. We handle the marketing and e-commerce technology so you can focus on creating.
                </p>
              </div>
               <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop" 
                  alt="Handmade plant pot" 
                  className="w-full h-100 object-cover"
                />
              </div>
              
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              <div className="rounded-lg overflow-hidden shadow-xl order-1 md:order-2 ">
                <img 
                  src="images\cup.jpeg" 
                  alt="Handmade bracelets" 
                  className="w-full h-100 object-cover"
                />
              </div>
              <div className="text-white order-2 md:order-1">
                <p className="text-lg leading-relaxed">
                  Your story is as valuable as your craft. We feature your profile and creative journey through our blog, social media, and marketing campaigns to build your brand and connect you with your audience.
                </p>
              </div>
            </div>
          </div>

          {/* Training & Workshops */}
          <div>
            <h3 className="text-xl font-semibold text-center text-gray-300 bg-gray-700 bg-opacity-70 py-3 rounded-lg mb-8">
              Training & Workshops
            </h3>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="images\kub.jpeg" 
                  alt="Basket weaving training" 
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
<section className="py-12 bg-[#202f32]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h3 className="text-2xl font-bold text-center text-orange-300 mb-8">
      Trainings Offered
    </h3>

    <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
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
          title: "handmade jewelries", 
          desc: "Create stylish  items and accessories for daily use.", 
          image: "/images/udukomo.jpeg" 
        },
        { 
          title: "imitako", 
          desc: "Create stylish crochet items and accessories for daily use.", 
          image: "/images/wall.jpeg" 
        }
      ].map((training, index) => (
        <div 
          key={index}
          className="relative flex-shrink-0 w-72 h-80 bg-gray-700 rounded-xl overflow-hidden shadow-lg group"
        >
          {/* Text content */}
          <div className="p-5 text-white flex flex-col justify-between h-full z-10 relative">
            <div>
              <h4 className="text-xl font-semibold mb-2">{training.title}</h4>
              <p className="text-sm text-gray-300">{training.desc}</p>
            </div>
          </div>

          {/* Hidden image (appears on hover) */}
          <img
            src={training.image}
            alt={training.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <a href="/login">
          <button className="bg-orange-300 hover:bg-orange-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors">
            Register/Login
          </button>
          </a>

          {/* Overlay when image appears */}
        
        </div>
      ))}
    </div>
  </div>
</section>

      </section>

      <Footer />
    </div>
  );
};

export default HomePage;