'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products?limit=5&sortBy=createdAt&sortOrder=DESC');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const fetched = data.data?.products || [];
        setProducts(fetched);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const getProductImage = (product) => {
    if (product.mainImage) {
      return `http://localhost:5000/${product.mainImage}`;
    }
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return `http://localhost:5000/${product.images[0]}`;
    }
    return '/images/bask.jpeg';
  };

  const handleImageError = (e) => {
    e.target.src = '/images/bask.jpeg';
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      const el = scrollRef.current;
      if (!el || products.length === 0) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 320, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 350);
    }, 4000);

    return () => clearInterval(autoSlide);
  }, [products]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Recently Added
            </h2>
            <p className="text-orange-400 font-medium mt-1 text-sm tracking-widest uppercase">
              Fresh from our artisans
            </p>
          </div>
          <a
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 bg-orange-300 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm"
          >
            <ShoppingBag size={16} />
            View All
          </a>
        </div>

        {/* Slider Wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:bg-orange-300 hover:text-white hover:border-orange-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:bg-orange-300 hover:text-white hover:border-orange-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-500">
                No products available yet.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image - no overlay div to avoid black box */}
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      onError={handleImageError}
                    />
                    <span className="absolute top-3 left-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      New
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-orange-400 uppercase tracking-widest font-medium mb-1">
                      {product.category?.name || 'Handmade'}
                    </p>
                    <h4 className="text-gray-800 font-semibold text-base leading-snug mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      By {product.artisan?.firstName} {product.artisan?.lastName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#202f32] font-bold text-lg">
                        {Number(product.price).toLocaleString()} RWF
                      </span>
                      <a
                        href={`/shop/${product.id}`}
                        className="bg-[#202f32] hover:bg-orange-400 text-white text-xs px-3 py-2 rounded-lg transition-all font-medium"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile View All button */}
        <div className="text-center mt-8 md:hidden">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-orange-300 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <ShoppingBag size={16} />
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentProducts;