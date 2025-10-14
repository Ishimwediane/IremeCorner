import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
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
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      {/* About Us Content */}
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Who we are Section */}
          <section className="mb-16 bg-gradient-to-br bg-[#202f32] rounded-lg shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-8">Who we are</h2>
            
            <div className="text-white text-lg leading-relaxed space-y-4">
              <p>
                In the vibrant hills of Rwanda, a rich tapestry of handmade crafts tells the story of our people. Yet, we saw the threads of this tapestry beginning to fray. Our master artisans struggled to find markets, and our youth disconnected from these ancestral skills. We founded <span className="text-orange-300 font-semibold">IremeCorner</span> as a bridge connecting the profound skill of our past with the dynamic innovation of our future.
              </p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=200&fit=crop" 
                  alt="Handmade crafts 1" 
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop" 
                  alt="Handmade crafts 2" 
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop" 
                  alt="Handmade crafts 3" 
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=200&fit=crop" 
                  alt="Handmade crafts 4" 
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </section>

          {/* Our mission Section */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-br bg-[#202f32] rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-orange-300 mb-6">Our mission</h2>
                <p className="text-white text-lg leading-relaxed">
                  To empower Rwandan artisans by providing a platform for sustainable income, preserving cultural heritage through the promotion of traditional crafts, and inspiring the next generation by training youth in both craft-making and entrepreneurship, ensuring our culture's legacy "empowering skill and innovation."
                </p>
              </div>

              <div className="rounded-full overflow-hidden shadow-xl w-64 h-64 mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop" 
                  alt="Traditional food display" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Our Vision Section */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-full overflow-hidden shadow-xl w-64 h-64 mx-auto order-2 md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1587562144991-84364eb80c0b?w=400&h=400&fit=crop" 
                  alt="Traditional baskets" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-gradient-to-br bg-[#202f32] rounded-lg shadow-xl p-8 order-1 md:order-2">
                <h2 className="text-3xl font-bold text-orange-300 mb-6">Our Vision</h2>
                <p className="text-white text-lg leading-relaxed">
                  To be Rwanda's landmark platform connecting national identity to authentic crafts, blending timeless artisan techniques with dynamic e-commerce tools, while inspiring a new generation in ancient crafts and modern economy in Rwanda.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Team Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-300 mb-12">Meet the Team</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src='url("/images/dia.png")'
                    alt="Diane CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Diane Ishimwe</h3>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src='url("/images/yve.jpg")'
                    alt="Yvette" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Yvette Kazeneza</h3>
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