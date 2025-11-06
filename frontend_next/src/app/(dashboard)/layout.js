// app/layout.js
'use client'; // This directive is necessary for using client-side features like useState in App Router components

import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname for active link logic
import Link from 'next/link'; // Import Link for navigation

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic here
  };

  const handleGoLive = () => {
    console.log('Go Live clicked');
    // Implement go live logic here
  };

  const handleSearch = (e) => {
    console.log('Searching for:', e.target.value);
  };

  return (
    <html lang="en">
      <body className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-[#e5e7eb] flex flex-col h-screen overflow-y-auto
                         transform transition-transform duration-300 md:translate-x-0
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-5 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                SL
              </div>
              <div className="text-xl font-bold text-[#111827]">ShopLive</div>
            </div>
          </div>

          <div
            className="p-4 border-b border-[#e5e7eb]"
            style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))' }}
          >
            <div className="text-sm font-semibold text-[#111827] mb-1">Golden Jewels</div>
            <div className="text-xs text-[#6b7280]">ID: SL-123456</div>
          </div>

          <nav className="flex-1 py-5">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                pathname === '/dashboard' ? 'active border-r-4 border-[#667eea] text-[#667eea]' : 'text-[#6b7280] hover:bg-gray-50 hover:text-[#667eea]'
              }`}
              style={pathname === '/dashboard' ? { background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' } : {}}
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/product"
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                pathname.startsWith('/product') ? 'active border-r-4 border-[#667eea] text-[#667eea]' : 'text-[#6b7280] hover:bg-gray-50 hover:text-[#667eea]'
              }`}
              style={pathname.startsWith('/product') ? { background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' } : {}}
            >
              <span className="text-xl">📦</span>
              <span>Products</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
            >
              <span className="text-xl">📅</span>
              <span>Reservations</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
            >
              <span className="text-xl">📺</span>
              <span>Live Streams</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
            >
              <span className="text-xl">📊</span>
              <span>Analytics</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
            >
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
            >
              <span className="text-xl">❓</span>
              <span>Help & Support</span>
            </Link>
          </nav>

          <button
            onClick={handleGoLive}
            className="m-5 p-3 sm:p-4 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0px 0px rgba(0,0,0,0)',
              '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            🎥 Go Live Now
          </button>

          <div className="p-5 border-t border-[#e5e7eb]">
            <button onClick={handleLogout} className="flex items-center gap-2 text-[#ef4444] text-sm font-medium cursor-pointer">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area Wrapper */}
        <div className="flex-1 flex flex-col md:ml-[260px]">
          {/* Top Bar */}
          <header
            className="bg-white p-4 sm:px-8 border-b border-[#e5e7eb] flex justify-between items-center sticky top-0 z-30"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            {/* Mobile Menu Button - Shown only on small screens */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-[#6b7280] hover:text-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea] rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Breadcrumb / Search Bar (simplified for layout) */}
            <div className="flex-1 max-w-sm mr-4 md:mr-0">
                {pathname.startsWith('/products/add') ? (
                    <div className="flex items-center gap-2 text-[#6b7280] text-sm">
                        <Link href="/products" className="text-[#667eea] hover:underline">Products</Link>
                        <span>›</span>
                        <span>Add Product</span>
                    </div>
                ) : (
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                            placeholder="Search..."
                            onChange={handleSearch}
                        />
                    </div>
                )}
            </div>


            <div className="flex items-center gap-4">
              <div className="relative p-2 cursor-pointer text-[#6b7280]">
                <span className="text-xl">🔔</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white"></div>
              </div>

              <div className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  GJ
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#111827]">Golden Jewels</div>
                  <div className="text-xs text-[#6b7280]">Seller</div>
                </div>
              </div>
            </div>
          </header>

          {/* This is where your page content will be rendered */}
          {children}
        </div>
      </body>
    </html>
  );
};

export default Layout;