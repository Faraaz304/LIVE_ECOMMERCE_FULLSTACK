// components/products/ProductCard.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Removed selectedProductIds, handleCheckboxChange props for user role
const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to the product view page within the (user) route group
    router.push(`/seller/products/view/${product.id}`);
  };

  // Removed handleEditClick as edit functionality is not for user role

  return (
    <div
      key={product.id}
      className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-px cursor-pointer" // Added cursor-pointer to the main div
      onClick={handleCardClick} // Make the entire card clickable
    >
      <div className="relative bg-gray-50 h-52 flex items-center justify-center text-6xl">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          product.icon // Fallback to emoji icon if no image URL
        )}

        <div
          className={`absolute top-3 right-3 py-1 px-3 rounded-full text-xs font-semibold ${
            product.status === 'active'
              ? 'bg-[#d1fae5] text-[#065f46]'
              : 'bg-gray-100 text-[#4b5563]'
          }`}
        >
          {product.status === 'active' ? 'Active' : 'Inactive'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#374151] mb-2 truncate">
          {product.name}
        </h3>
        <div className="text-2xl font-bold text-[#667eea] mb-2">₹{product.price}</div>
        <div className="flex gap-2 mb-3 text-xs">
          {/* Removed product categories/tags if they were here, keep if relevant for display */}
        </div>
        <div className="flex justify-between items-center text-sm text-[#6b7280] mb-3">
          <span>
            Stock:{' '}
            <span
              className={`font-semibold ${
                product.stock === 0 ? 'text-[#ef4444]' : 'text-[#374151]'
              }`}
            >
              {product.stock}
            </span>
          </span>
        </div>
      </div>

      {/* Removed the entire actions div with 'Edit' button for user role */}
      {/* <div className="flex gap-2 p-4 pt-0">...</div> */}
    </div>
  );
};

export default ProductCard;