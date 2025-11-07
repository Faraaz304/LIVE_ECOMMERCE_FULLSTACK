'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = ({ sidebarOpen, setSidebarOpen, handleSearch }) => {
  const pathname = usePathname();

  return (
    <header
      className="bg-white p-4 sm:px-8 border-b border-[#e5e7eb] flex justify-between items-center sticky top-0 z-30"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    >
      {/* Mobile Menu Button */}
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

      {/* Search / Breadcrumb */}
      <div className="flex-1 max-w-sm mr-4 md:mr-0">
        {pathname.startsWith('/products/add') ? (
          <div className="flex items-center gap-2 text-[#6b7280] text-sm">
            <Link href="/products" className="text-[#667eea] hover:underline">
              Products
            </Link>
            <span>›</span>
            <span>Add Product</span>
          </div>
        ) : (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
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

      {/* Right Icons */}
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
  );
};

export default Navbar;
