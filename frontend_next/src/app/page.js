// For Pages Router: pages/index.js
// For App Router: app/page.js
"use client"
import React, { useState } from 'react';
import Head from 'next/head'; // Only needed for Pages Router

const Home = () => {
  const [annotationsOpen, setAnnotationsOpen] = useState(true);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      {/* Head section for Pages Router */}
      {/* For App Router, metadata is defined in layout.js or page.js export */}
      <Head>
        <title>ShopLive Seller - Login</title>
        <meta name="description" content="ShopLive Seller Dashboard Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white px-4 sm:px-8 lg:px-16 py-5 shadow-light flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            SL
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-dark-text">ShopLive</h1>
            <p className="text-xs sm:text-sm text-gray-text font-medium">Seller Dashboard</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-5 sm:gap-8 items-center">
          <a href="#" className="text-gray-text text-sm sm:text-base font-medium hover:text-primary-blue transition-colors">Features</a>
          <a href="#" className="text-gray-text text-sm sm:text-base font-medium hover:text-primary-blue transition-colors">Pricing</a>
          <a href="#" className="text-gray-text text-sm sm:text-base font-medium hover:text-primary-blue transition-colors">Support</a>
          <a href="#" className="text-gray-text text-sm sm:text-base font-medium hover:text-primary-blue transition-colors">Download App</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 max-w-6xl w-full items-center">
          {/* Left Side - Hero Section */}
          <div className="py-10 px-4 text-center md:text-left">
            <span className="inline-block bg-gradient-primary-light text-primary-blue px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-5">
              🚀 Start Selling in Minutes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-text leading-tight mb-5">
              Grow Your Business with{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Live Commerce</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-text leading-relaxed mb-7">
              Stream live, showcase your products, and get customers to visit your shop.
              The easiest way to connect with local buyers.
            </p>

            <ul className="list-none mb-7">
              <li className="flex items-center justify-center md:justify-start gap-3 py-3 text-medium-gray text-base">
                <span className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✓
                </span>
                <span>Go live and showcase products in real-time</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 py-3 text-medium-gray text-base">
                <span className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✓
                </span>
                <span>Customers book visits to your physical shop</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 py-3 text-medium-gray text-base">
                <span className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✓
                </span>
                <span>Easy product management & inventory tracking</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 py-3 text-medium-gray text-base">
                <span className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✓
                </span>
                <span>No upfront costs, pay only per transaction</span>
              </li>
            </ul>

            <div className="flex justify-center md:justify-start gap-10 mt-7">
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl font-bold text-primary-blue mb-1">500+</div>
                <div className="text-sm text-gray-text">Active Sellers</div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl font-bold text-primary-blue mb-1">10K+</div>
                <div className="text-sm text-gray-text">Shop Visits</div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl font-bold text-primary-blue mb-1">₹5Cr+</div>
                <div className="text-sm text-gray-text">Sales Generated</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-medium w-full max-w-md mx-auto">
            <div className="mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-text">Login to your seller dashboard</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-semibold text-medium-gray mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-gray-text text-lg">📱</span>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border-gray rounded-xl text-base focus:outline-none focus:border-primary-blue focus:shadow-outline-primary transition-all duration-300"
                    placeholder="+91 98765 43210"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold text-medium-gray mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-gray-text text-lg">🔒</span>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-border-gray rounded-xl text-base focus:outline-none focus:border-primary-blue focus:shadow-outline-primary transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <input type="checkbox" id="remember" className="w-4 h-4 cursor-pointer accent-primary-blue" />
                <label htmlFor="remember" className="text-sm text-gray-text cursor-pointer">Remember me</label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-primary text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-primary-hover"
              >
                Login to Dashboard
              </button>

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-border-gray"></div>
                <span className="text-sm text-light-gray-text">OR</span>
                <div className="flex-1 h-px bg-border-gray"></div>
              </div>

              <p className="text-center text-sm text-gray-text mt-6">
                New seller? <a href="#" className="text-primary-blue font-semibold hover:underline">Register your shop</a>
              </p>

              <p className="text-center text-sm text-gray-text mt-3">
                <a href="#" className="text-primary-blue font-semibold hover:underline">Forgot password?</a>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 sm:py-8 border-t border-border-gray text-center px-4">
        <div className="flex justify-center gap-6 sm:gap-8 mb-4">
          <a href="#" className="text-gray-text text-sm hover:text-primary-blue">Terms of Service</a>
          <a href="#" className="text-gray-text text-sm hover:text-primary-blue">Privacy Policy</a>
          <a href="#" className="text-gray-text text-sm hover:text-primary-blue">Help Center</a>
          <a href="#" className="text-gray-text text-sm hover:text-primary-blue">Contact Us</a>
        </div>
        <p className="text-xs text-light-gray-text">© 2025 ShopLive. All rights reserved.</p>
      </footer>

      {/* Annotations Panel */}
      {annotationsOpen && (
        <div className="fixed bottom-5 right-5 bg-white rounded-xl shadow-strong p-5 max-w-xs z-50">
          <button
            onClick={() => setAnnotationsOpen(false)}
            className="absolute top-2.5 right-2.5 bg-transparent border-none text-xl cursor-pointer text-light-gray-text hover:text-dark-text"
          >
            &times;
          </button>
          <h4 className="text-base font-semibold text-dark-text mb-3 flex items-center gap-2">
            📋 Screen Details
          </h4>
          <ul className="list-none">
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Split-screen layout (Hero + Form)</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Phone number login (OTP sent after)</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Link to registration page</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Responsive: stacks on mobile</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Social proof with stats</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Features highlight value prop</li>
            <li className="text-sm text-gray-text mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue before:font-bold">Next: OTP Verification screen</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;