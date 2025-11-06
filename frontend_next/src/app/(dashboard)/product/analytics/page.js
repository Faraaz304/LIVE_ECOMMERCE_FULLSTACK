'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// NO METADATA EXPORT IN THIS FILE, as requested.

const dummyAnalyticsData = {
  summary: {
    totalProducts: 138,
    totalProductsChange: '+12 new this month',
    totalViews: '45,287',
    totalViewsChange: '+24% vs last month',
    conversionRate: '8.4%',
    conversionRateChange: '+1.2% improvement',
    revenueGenerated: '₹12.8L',
    revenueGeneratedChange: '+18% vs last month',
  },
  chartData: {
    views: [60, 75, 45, 85, 70, 90, 65], // Heights for bars
    reservations: [30, 40, 20, 50, 35, 60, 30],
    revenue: [50, 65, 35, 75, 55, 80, 40],
  },
  categories: [
    {
      name: 'Necklace Sets',
      icon: '💎',
      views: '12,543',
      products: 24,
      reservations: 156,
      revenue: '₹5.2L',
    },
    {
      name: 'Rings',
      icon: '💍',
      views: '8,921',
      products: 18,
      reservations: 98,
      revenue: '₹3.8L',
    },
    {
      name: 'Earrings',
      icon: '👂',
      views: '15,234',
      products: 32,
      reservations: 187,
      revenue: '₹3.8L',
    },
  ],
  topPerformingProducts: [
    {
      id: 'GN-22K-001',
      icon: '💎',
      name: '22K Gold Traditional Necklace Set',
      views: '2,547',
      pinned: 18,
      reservations: 156,
      revenue: '₹38.2L',
      conversion: '6.1%',
      conversionClass: 'high',
    },
    {
      id: 'GR-18K-DIA-002',
      icon: '💍',
      name: '18K Gold Diamond Engagement Ring',
      views: '1,892',
      pinned: 12,
      reservations: 98,
      revenue: '₹12.2L',
      conversion: '5.2%',
      conversionClass: 'high',
    },
    {
      id: 'GBC-22K-CHKR-001',
      icon: '👑',
      name: '22K Gold Bridal Choker Set',
      views: '1,653',
      pinned: 15,
      reservations: 87,
      revenue: '₹27.8L',
      conversion: '5.3%',
      conversionClass: 'high',
    },
    {
      id: 'GB-22K-ANT-006',
      icon: '⚪',
      name: '22K Gold Antique Bangles (Set of 6)',
      views: '1,421',
      pinned: 8,
      reservations: 76,
      revenue: '₹14.1L',
      conversion: '5.3%',
      conversionClass: 'medium',
    },
    {
      id: 'RGB-18K-ROSE-005',
      icon: '📿',
      name: '18K Rose Gold Bracelet',
      views: '1,298',
      pinned: 10,
      reservations: 65,
      revenue: '₹6.2L',
      conversion: '5.0%',
      conversionClass: 'medium',
    },
  ],
  lowPerformingProducts: [
    {
      id: 'GS-14K-CUB-001',
      icon: '✨',
      name: '14K Gold Cubic Zirconia Studs',
      views: '450',
      pinned: 2,
      reservations: 5,
      revenue: '₹0.5L',
      conversion: '2.1%',
      conversionClass: 'low',
    },
    {
      id: 'GP-22K-FLW-003',
      icon: '🌸',
      name: '22K Gold Floral Pendant',
      views: '380',
      pinned: 1,
      reservations: 3,
      revenue: '₹0.3L',
      conversion: '1.8%',
      conversionClass: 'low',
    },
    {
      id: 'GN-18K-SLIM-010',
      icon: '🔗',
      name: '18K Gold Slim Chain',
      views: '210',
      pinned: 0,
      reservations: 1,
      revenue: '₹0.1L',
      conversion: '0.9%',
      conversionClass: 'low',
    },
  ],
};

const ProductAnalyticsPage = () => {
  const [activeChart, setActiveChart] = useState('views'); // 'views', 'reservations', 'revenue'

  const getChartData = () => {
    switch (activeChart) {
      case 'views':
        return dummyAnalyticsData.chartData.views;
      case 'reservations':
        return dummyAnalyticsData.chartData.reservations;
      case 'revenue':
        return dummyAnalyticsData.chartData.revenue;
      default:
        return dummyAnalyticsData.chartData.views;
    }
  };

  const getConversionBadgeClass = (conversionClass) => {
    switch (conversionClass) {
      case 'high':
        return 'bg-[#d1fae5] text-[#065f46]';
      case 'medium':
        return 'bg-[#fef3c7] text-[#92400e]';
      case 'low':
        return 'bg-[#fee2e2] text-[#991b1b]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Product Performance Analytics</h1>
        <p className="text-base text-[#6b7280]">
          Analyze your jewelry product performance and insights
        </p>
      </div>

      {/* Alert Card */}
      <div
        className="rounded-xl p-5 mb-6 flex items-center gap-4"
        style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
      >
        <div
          className="w-10 h-10 bg-[#fee2e2] rounded-full flex items-center justify-center text-xl flex-shrink-0"
        >
          📉
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-[#991b1b] mb-1">Low Performing Products Detected</h3>
          <p className="text-sm text-[#dc2626]">
            3 products have low conversion rates. Consider updating descriptions or pricing.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div
          className="bg-white rounded-xl border border-[#e5e7eb] p-6 transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
            style={{ background: 'rgba(59, 130, 246, 0.1)' }}
          >
            📦
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">{dummyAnalyticsData.summary.totalProducts}</div>
          <div className="text-sm text-[#6b7280] mb-2">Total Products</div>
          <div className="text-xs text-[#10b981] flex items-center gap-1">
            ↑ {dummyAnalyticsData.summary.totalProductsChange}
          </div>
        </div>

        <div
          className="bg-white rounded-xl border border-[#e5e7eb] p-6 transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
            style={{ background: 'rgba(16, 185, 129, 0.1)' }}
          >
            👁️
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">{dummyAnalyticsData.summary.totalViews}</div>
          <div className="text-sm text-[#6b7280] mb-2">Total Views</div>
          <div className="text-xs text-[#10b981] flex items-center gap-1">
            ↑ {dummyAnalyticsData.summary.totalViewsChange}
          </div>
        </div>

        <div
          className="bg-white rounded-xl border border-[#e5e7eb] p-6 transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
            style={{ background: 'rgba(139, 92, 246, 0.1)' }}
          >
            🎯
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">{dummyAnalyticsData.summary.conversionRate}</div>
          <div className="text-sm text-[#6b7280] mb-2">Conversion Rate</div>
          <div className="text-xs text-[#10b981] flex items-center gap-1">
            ↑ {dummyAnalyticsData.summary.conversionRateChange}
          </div>
        </div>

        <div
          className="bg-white rounded-xl border border-[#e5e7eb] p-6 transition-all duration-300 hover:-translate-y-px"
          style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 4px 12px rgba(0,0,0,0.08)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
            style={{ background: 'rgba(245, 158, 11, 0.1)' }}
          >
            💰
          </div>
          <div className="text-3xl font-bold text-[#111827] mb-1">{dummyAnalyticsData.summary.revenueGenerated}</div>
          <div className="text-sm text-[#6b7280] mb-2">Revenue Generated</div>
          <div className="text-xs text-[#10b981] flex items-center gap-1">
            ↑ {dummyAnalyticsData.summary.revenueGeneratedChange}
          </div>
        </div>
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h3 className="text-lg font-bold text-[#111827]">Product Views Over Time</h3>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all ${
                activeChart === 'views' ? 'bg-white shadow-sm text-[#667eea]' : ''
              }`}
              onClick={() => setActiveChart('views')}
            >
              Views
            </button>
            <button
              className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all ${
                activeChart === 'reservations' ? 'bg-white shadow-sm text-[#667eea]' : ''
              }`}
              onClick={() => setActiveChart('reservations')}
            >
              Reservations
            </button>
            <button
              className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all ${
                activeChart === 'revenue' ? 'bg-white shadow-sm text-[#667eea]' : ''
              }`}
              onClick={() => setActiveChart('revenue')}
            >
              Revenue
            </button>
          </div>
        </div>
        <div
          className="w-full h-[300px] rounded-lg relative overflow-hidden flex items-end justify-around p-5"
          style={{ background: 'linear-gradient(to top, rgba(102, 126, 234, 0.05), transparent)' }}
        >
          {/* Chart bars */}
          {getChartData().map((height, index) => (
            <div
              key={index}
              className="w-10 rounded-t-md"
              style={{ height: `${height}%`, background: 'linear-gradient(to top, #667eea, #764ba2)' }}
            ></div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {dummyAnalyticsData.categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-[#374151]">{category.name}</span>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-[#667eea] mb-1">{category.views}</div>
                <div className="text-xs text-[#6b7280]">Views</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-[#667eea] mb-1">{category.products}</div>
                <div className="text-xs text-[#6b7280]">Products</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-[#667eea] mb-1">{category.reservations}</div>
                <div className="text-xs text-[#6b7280]">Reservations</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-[#667eea] mb-1">{category.revenue}</div>
                <div className="text-xs text-[#6b7280]">Revenue</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-8">
        <div className="p-5 border-b border-[#e5e7eb] flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#111827]">📈 Top Performing Products</h3>
          <Link href="/products" className="text-sm text-[#667eea] font-semibold hover:underline">
            View All →
          </Link>
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Product</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Views</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Pinned</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Reservations</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Revenue</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {dummyAnalyticsData.topPerformingProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-b-0">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {product.icon}
                    </div>
                    <span className="text-sm font-semibold text-[#374151]">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.views}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.pinned}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.reservations}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.revenue}</span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`py-1 px-2 rounded-md text-xs font-semibold ${getConversionBadgeClass(product.conversionClass)}`}
                  >
                    {product.conversion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Performing Products */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb] flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#111827]">📉 Products Needing Attention</h3>
          <Link href="/products" className="text-sm text-[#667eea] font-semibold hover:underline">
            View All →
          </Link>
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Product</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Views</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Pinned</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Reservations</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Revenue</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {dummyAnalyticsData.lowPerformingProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-[#fef2f2] last:border-b-0">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {product.icon}
                    </div>
                    <span className="text-sm font-semibold text-[#374151]">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.views}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.pinned}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.reservations}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-base font-semibold text-[#374151]">{product.revenue}</span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`py-1 px-2 rounded-md text-xs font-semibold ${getConversionBadgeClass(product.conversionClass)}`}
                  >
                    {product.conversion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductAnalyticsPage;