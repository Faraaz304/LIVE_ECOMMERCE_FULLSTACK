// app/dashboard/page.js (for App Router)
// If using Pages Router, create pages/dashboard.js
"use client"
import React from 'react';
// If using Pages Router, you might still need Head here for specific page metadata
// import Head from 'next/head';

// For App Router, metadata is defined by exporting a metadata object


const DashboardPage = () => {
  return (
    // This div represents the main content area *after* the header in the layout
    <div className="p-8 flex-1">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Welcome back, Kumar! 👋</h1>
        <p className="text-base text-[#6b7280]">Here's what's happening with your shop today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div
          className="bg-white p-6 rounded-xl border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}
            >
              📅
            </div>
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">8</div>
          <div className="text-sm text-[#6b7280]">Today's Reservations</div>
          <div className="flex items-center gap-1 text-xs mt-2 text-[#10b981]">
            <span>↑ 12%</span>
            <span className="text-[#9ca3af]">vs yesterday</span>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-xl border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              📦
            </div>
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">24</div>
          <div className="text-sm text-[#6b7280]">Total Products</div>
          <div className="flex items-center gap-1 text-xs mt-2 text-[#10b981]">
            <span>↑ 3</span>
            <span className="text-[#9ca3af]">this week</span>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-xl border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: 'rgba(139, 92, 246, 0.1)' }}
            >
              📺
            </div>
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">156</div>
          <div className="text-sm text-[#6b7280]">Stream Views</div>
          <div className="flex items-center gap-1 text-xs mt-2 text-[#10b981]">
            <span>↑ 24%</span>
            <span className="text-[#9ca3af]">this week</span>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-xl border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              ⭐
            </div>
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">4.8</div>
          <div className="text-sm text-[#6b7280]">Average Rating</div>
          <div className="flex items-center gap-1 text-xs mt-2 text-[#10b981]">
            <span>↑ 0.2</span>
            <span className="text-[#9ca3af]">this month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a
          href="#"
          className="bg-white p-5 rounded-xl border-2 border-dashed border-[#e5e7eb] text-center cursor-pointer transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
        >
          <div className="text-4xl mb-2">➕</div>
          <div className="text-sm font-semibold text-[#374151]">Add Product</div>
        </a>

        <a
          href="#"
          className="bg-white p-5 rounded-xl border-2 border-dashed border-[#e5e7eb] text-center cursor-pointer transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
        >
          <div className="text-4xl mb-2">📅</div>
          <div className="text-sm font-semibold text-[#374151]">View Schedule</div>
        </a>

        <a
          href="#"
          className="bg-white p-5 rounded-xl border-2 border-dashed border-[#e5e7eb] text-center cursor-pointer transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
        >
          <div className="text-4xl mb-2">📊</div>
          <div className="text-sm font-semibold text-[#374151]">View Analytics</div>
        </a>

        <a
          href="#"
          className="bg-white p-5 rounded-xl border-2 border-dashed border-[#e5e7eb] text-center cursor-pointer transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
        >
          <div className="text-4xl mb-2">📦</div>
          <div className="text-sm font-semibold text-[#374151]">Manage Inventory</div>
        </a>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Reservations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-[#111827]">Today's Reservations</h2>
            <a href="#" className="text-sm text-[#667eea] font-semibold hover:underline">View All →</a>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center">
            <div>
              <div className="text-base font-semibold text-[#111827] mb-1">Priya Sharma</div>
              <div className="text-sm text-[#6b7280]">10:00 AM • Interested in: iPhone 14</div>
            </div>
            <div
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
            >
              Confirmed
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center">
            <div>
              <div className="text-base font-semibold text-[#111827] mb-1">Amit Patel</div>
              <div className="text-sm text-[#6b7280]">11:30 AM • Interested in: Samsung S23</div>
            </div>
            <div
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
            >
              Confirmed
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-base font-semibold text-[#111827] mb-1">Rahul Singh</div>
              <div className="text-sm text-[#6b7280]">2:00 PM • Interested in: OnePlus 11</div>
            </div>
            <div
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
            >
              Confirmed
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-[#111827]">Recent Activity</h2>
          </div>

          <div className="flex gap-3 py-4 border-b border-[#e5e7eb] last:border-b-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              ✓
            </div>
            <div>
              <div className="text-sm text-[#374151] mb-1">New reservation from <strong>Priya Sharma</strong></div>
              <div className="text-xs text-[#9ca3af]">10 minutes ago</div>
            </div>
          </div>

          <div className="flex gap-3 py-4 border-b border-[#e5e7eb] last:border-b-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}
            >
              📦
            </div>
            <div>
              <div className="text-sm text-[#374151] mb-1">Product <strong>iPhone 14</strong> was updated</div>
              <div className="text-xs text-[#9ca3af]">1 hour ago</div>
            </div>
          </div>

          <div className="flex gap-3 py-4 border-b border-[#e5e7eb] last:border-b-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              ⭐
            </div>
            <div>
              <div className="text-sm text-[#374151] mb-1">New 5-star review received</div>
              <div className="text-xs text-[#9ca3af]">2 hours ago</div>
            </div>
          </div>

          <div className="flex gap-3 py-4 last:border-b-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}
            >
              📺
            </div>
            <div>
              <div className="text-sm text-[#374151] mb-1">Your live stream reached <strong>150 viewers</strong></div>
              <div className="text-xs text-[#9ca3af]">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;