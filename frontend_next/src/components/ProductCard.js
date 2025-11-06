// components/ProductCard.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product, selectedProductIds, handleCheckboxChange }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/product/view/${product.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click when edit button is clicked
    router.push(`/product/edit/${product.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    alert(`Delete product ${product.name} (functionality not implemented)`);
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation(); // Prevent card click
    alert(`Duplicate product ${product.name} (functionality not implemented)`);
  };

  return (
    <div
      key={product.id}
      className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-px"
    >
      {/* Clickable area for viewing product details */}
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="relative bg-gray-50 h-52 flex items-center justify-center text-6xl">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            product.icon // Fallback to emoji icon if no image URL
          )}
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-md cursor-pointer accent-[#667eea]"
              checked={selectedProductIds.has(product.id)}
              onChange={(e) => {
                e.stopPropagation(); // Prevent card click when checkbox is clicked
                handleCheckboxChange(product.id, e.target.checked);
              }}
            />
          </div>
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
            <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280] font-medium">
              {product.karat}
            </span>
            <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280] font-medium">
              {product.weight}
            </span>
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
            <span className="text-xs bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">
              {product.sku}
            </span>
          </div>
        </div>
      </div>

      {/* Actions below the clickable area */}
      <div className="flex gap-2 p-4 pt-0">
        <button
          onClick={handleEditClick}
          className="flex-1 py-2 px-3 rounded-lg cursor-pointer text-sm font-medium flex items-center justify-center gap-1 transition-all bg-[#667eea]/[0.1] text-[#667eea] hover:bg-[#667eea]/[0.15]"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDuplicateClick}
          className="p-2 rounded-lg cursor-pointer text-xl text-[#6b7280] transition-all hover:bg-gray-100"
        >
          📋
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2 rounded-lg cursor-pointer text-xl text-[#6b7280] transition-all hover:bg-gray-100"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;