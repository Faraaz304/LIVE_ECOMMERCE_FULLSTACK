'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // For App Router dynamic params and navigation

// NO METADATA EXPORT IN THIS FILE, as requested.

// Dummy product data for demonstration
const dummyProductDetail = {
  id: 'GN-22K-001',
  name: '22K Gold Traditional Necklace Set',
  description:
    'Exquisite 22K gold traditional necklace set crafted with intricate South Indian temple designs. Features detailed goddess motifs and kemp stone embellishments. Perfect for weddings and special occasions. Comes with matching earrings and elegant packaging. Hallmarked for purity and authenticity.',
  sku: 'GN-22K-001',
  createdAt: 'Jan 15, 2025',
  status: 'active',
  stock: 3,
  category: 'Necklace Sets',
  subcategory: 'Temple Jewelry', // Added subcategory for detail view
  price: 245000,
  originalPrice: 260000, // For demonstration of sale price
  salePrice: 245000,
  makingCharges: 15000,
  gstRate: '3%',
  purity: '22K Gold',
  weight: '45.5 grams',
  tags: ['Wedding', 'Traditional', 'Temple'],
  images: [
    { url: '/images/product-necklace1.jpg', emoji: '💎' }, // Use actual image paths or base64
    { url: '/images/product-necklace2.jpg', emoji: '💍' },
    { url: '/images/product-earrings.jpg', emoji: '👂' },
    { url: '/images/product-ring.jpg', emoji: '✨' },
    { url: '/images/product-bracelet.jpg', emoji: '💫' },
  ],
  performance: {
    totalViews: '2,547',
    totalViewsChange: '+24% vs last month',
    timesPinned: 18,
    timesPinnedChange: '+3 new pins',
    reservationsGenerated: 12,
    reservationsChange: '+50% conversion',
    conversionRate: '4.7%',
    conversionRateChange: '+1.2% improvement',
    last7DaysViews: 450, // Added for analytics card
  },
  recentActivity: [
    {
      icon: '📌',
      iconBg: 'rgba(102, 126, 234, 0.1)', // purple-ish
      text: 'Pinned in live stream <strong>"New Collection Launch"</strong>',
      time: '2 days ago',
    },
    {
      icon: '👁️',
      iconBg: 'rgba(59, 130, 246, 0.1)', // blue
      text: 'Viewed by <strong>156 customers</strong> this week',
      time: '3 days ago',
    },
    {
      icon: '📅',
      iconBg: 'rgba(16, 185, 129, 0.1)', // green
      text: 'Generated <strong>3 new reservations</strong>',
      time: '5 days ago',
    },
    {
      icon: '✏️',
      iconBg: 'rgba(59, 130, 246, 0.1)', // blue
      text: 'Product details updated',
      time: '1 week ago',
    },
  ],
};

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productId } = params;

  // In a real app, you would fetch product data based on productId here.
  // For this example, we'll use dummyProductDetail.
  const product = dummyProductDetail; // Assume we found the product

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const currentMainImage = product.images[mainImageIndex];
  const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const showOriginalPrice = product.salePrice && product.salePrice < product.price;
  const discountPercentage = showOriginalPrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const handleEditProduct = () => {
    router.push(`/products/edit/${productId}`);
  };

  const handleDuplicateProduct = () => {
    console.log('Duplicating product:', productId);
    alert(`Duplicating product ${productId} (functionality not implemented).`);
  };

  const handleShareLink = () => {
    const productUrl = `${window.location.origin}/customer/product/${productId}`; // Example customer-facing URL
    navigator.clipboard.writeText(productUrl);
    alert('Product share link copied to clipboard!');
  };

  const handleDeleteProduct = () => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      console.log('Deleting product:', productId);
      // Implement actual deletion logic, then redirect
      alert(`Product ${productId} deleted (functionality not implemented).`);
      router.push('/products'); // Redirect to products list after deletion
    }
  };

  const handlePinToStream = () => {
    console.log('Pinning to next stream:', productId);
    alert(`Pinning ${product.name} to next stream (functionality not implemented).`);
  };

  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">{product.name}</h1>
          <p className="text-sm text-[#6b7280] mb-3">
            SKU: {product.sku} • Created: {product.createdAt}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                product.status === 'active'
                  ? 'bg-[#d1fae5] text-[#065f46]'
                  : 'bg-gray-100 text-[#4b5563]'
              }`}
            >
              {product.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <div className="text-sm text-[#6b7280]">
              <strong>Stock:</strong> {product.stock} units
            </div>
            <div className="text-sm text-[#6b7280]">
              <strong>Category:</strong> {product.category}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEditProduct}
            className="py-3 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0px 0px rgba(0,0,0,0)',
              '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            ✏️ Edit Product
          </button>
          <button
            onClick={handleDuplicateProduct}
            className="py-3 px-5 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50"
          >
            📋 Duplicate
          </button>
          <button
            onClick={handleShareLink}
            className="py-3 px-5 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50"
          >
            🔗 Share Link
          </button>
          <button
            onClick={handleDeleteProduct}
            className="py-3 px-5 bg-white text-[#ef4444] border-2 border-[#fecaca] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-[#fef2f2]"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Left Column */}
        <div>
          {/* Product Gallery */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-[128px] mb-4 border-2 border-[#e5e7eb]">
              {currentMainImage.url ? (
                <img src={currentMainImage.url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                currentMainImage.emoji
              )}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square bg-gray-50 rounded-lg border-2 border-[#e5e7eb] flex items-center justify-center text-3xl cursor-pointer transition-all ${
                    index === mainImageIndex ? 'border-[#667eea] bg-[#667eea]/[0.05]' : 'hover:border-[#667eea]'
                  }`}
                  onClick={() => setMainImageIndex(index)}
                >
                  {image.url ? (
                    <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    image.emoji
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">Product Description</h2>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">📊 Performance Metrics (Last 30 Days)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#667eea] mb-1">{product.performance.totalViews}</div>
                <div className="text-sm text-[#6b7280]">Total Views</div>
                <div className="text-xs mt-1 text-[#10b981]">{product.performance.totalViewsChange}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#667eea] mb-1">{product.performance.timesPinned}</div>
                <div className="text-sm text-[#6b7280]">Times Pinned in Streams</div>
                <div className="text-xs mt-1 text-[#10b981]">{product.performance.timesPinnedChange}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#667eea] mb-1">{product.performance.reservationsGenerated}</div>
                <div className="text-sm text-[#6b7280]">Reservations</div>
                <div className="text-xs mt-1 text-[#10b981]">{product.performance.reservationsChange}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#667eea] mb-1">{product.performance.conversionRate}</div>
                <div className="text-sm text-[#6b7280]">Conversion Rate</div>
                <div className="text-xs mt-1 text-[#10b981]">{product.performance.conversionRateChange}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Product Info */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">💰 Pricing & Details</h2>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Price</span>
              <span className="text-lg font-bold text-[#667eea]">
                ₹{new Intl.NumberFormat('en-IN').format(displayPrice)}
                {showOriginalPrice && (
                    <span className="text-base text-[#9ca3af] line-through ml-2">₹{new Intl.NumberFormat('en-IN').format(product.originalPrice)}</span>
                )}
                {discountPercentage > 0 && (
                    <span className="inline-block bg-[#fef2f2] text-[#dc2626] py-1 px-2 rounded-md text-xs font-semibold ml-2">
                        {discountPercentage}% OFF
                    </span>
                )}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Purity</span>
              <span className="text-sm font-semibold text-[#374151]">
                <span className="bg-[#667eea]/[0.1] text-[#667eea] py-1 px-2 rounded-md text-xs font-medium">
                  {product.purity}
                </span>
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Weight</span>
              <span className="text-sm font-semibold text-[#374151]">{product.weight}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Stock Quantity</span>
              <span className="text-sm font-semibold text-[#374151]">{product.stock} units</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Category</span>
              <span className="text-sm font-semibold text-[#374151]">{product.category}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Subcategory</span>
              <span className="text-sm font-semibold text-[#374151]">{product.subcategory}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-[#6b7280]">Making Charges</span>
              <span className="text-sm font-semibold text-[#374151]">₹{new Intl.NumberFormat('en-IN').format(product.makingCharges)}</span>
            </div>

            <div className="flex justify-between py-3 last:border-b-0">
              <span className="text-sm font-medium text-[#6b7280]">GST Rate</span>
              <span className="text-sm font-semibold text-[#374151]">{product.gstRate}</span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                <span className="text-sm font-medium text-[#6b7280]">Tags</span>
                <span className="text-sm font-semibold text-[#374151] flex flex-wrap gap-2 justify-end max-w-[60%]">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 py-1 px-2 rounded-md text-xs text-[#4b5563] font-medium">
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">⚡ Quick Actions</h2>
            <button
              onClick={handlePinToStream}
              className="w-full py-3 px-4 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px mb-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              📌 Pin to Next Stream
            </button>
            <button
              onClick={() => console.log('View full analytics clicked')}
              className="w-full py-3 px-4 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.02] mb-3"
            >
              📊 View Full Analytics
            </button>
            <button
              onClick={() => console.log('Share on social clicked')}
              className="w-full py-3 px-4 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.02] mb-3"
            >
              📱 Share on Social Media
            </button>
            <button
              onClick={() => console.log('Download QR Code clicked')}
              className="w-full py-3 px-4 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
            >
              📷 Download QR Code
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4">🕐 Recent Activity</h2>

            {product.recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: activity.iconBg }}
                >
                  {activity.icon}
                </div>
                <div>
                  <div className="text-sm text-[#374151] mb-1" dangerouslySetInnerHTML={{ __html: activity.text }}></div>
                  <div className="text-xs text-[#9ca3af]">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;