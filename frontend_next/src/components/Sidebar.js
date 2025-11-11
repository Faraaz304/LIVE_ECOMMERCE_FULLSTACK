'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ sidebarOpen, handleGoLive, handleLogout }) => {
  const pathname = usePathname();

  if(localStorage.getItem('userRole') == 'user'){
  }
  
  return (
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
            pathname === '/dashboard'
              ? 'active border-r-4 border-[#667eea] text-[#667eea]'
              : 'text-[#6b7280] hover:bg-gray-50 hover:text-[#667eea]'
          }`}
          style={
            pathname === '/dashboard'
              ? { background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }
              : {}
          }
        >
          <span className="text-xl">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/product"
          className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
            pathname.startsWith('/product')
              ? 'active border-r-4 border-[#667eea] text-[#667eea]'
              : 'text-[#6b7280] hover:bg-gray-50 hover:text-[#667eea]'
          }`}
          style={
            pathname.startsWith('/product')
              ? { background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }
              : {}
          }
        >
          <span className="text-xl">📦</span>
          <span>Products</span>
        </Link>

        <Link
          href="/reservation"
          className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
        >
          <span className="text-xl">📅</span>
          <span>Reservations</span>
        </Link>

        <Link
          href="/stream"
          className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
        >
          <span className="text-xl">📺</span>
          <span>Live Streams</span>
        </Link>

        <Link
          href="/analytics"
          className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
        >
          <span className="text-xl">📊</span>
          <span>Analytics</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-5 py-3 text-[#6b7280] text-sm font-medium hover:bg-gray-50 hover:text-[#667eea] transition-all"
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </Link>

        <Link
          href="/help"
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
  );
};

export default Sidebar;
