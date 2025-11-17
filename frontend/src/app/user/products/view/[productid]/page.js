'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UserProductDetailPage = () => { // Renamed component for clarity
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  const {
    product,
    isLoading,
    error,
    getProductById,
    // deleteProduct is not needed here as there's no delete functionality
  } = useProducts();

  // No need for showDeleteModal state as delete functionality is removed
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    if (productid) {
      getProductById(productid);
    }
  }, [productid, getProductById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <div className="max-w-[1400px] mx-auto p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-[#6b7280]">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where product is null after loading (e.g., 404)
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <div className="max-w-[1400px] mx-auto p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-[#ef4444] mb-4">{error || 'Product not found'}</p>
            <Button onClick={() => router.push('/user/products')}> {/* Redirect to user's products page */}
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // handleEditProduct and handleDeleteProduct are removed

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#111827] mb-2">{product.name}</h1>
            <p className="text-sm text-[#6b7280] mb-3">
              ID: {product.id} • Created: {formatDate(product.createdAt)}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={product.live ? 'default' : 'secondary'} className={product.live ? 'bg-[#d1fae5] text-[#065f46] hover:bg-[#d1fae5]' : ''}>
                {product.live ? 'Live' : 'Not Live'}
              </Badge>
              <div className="text-sm text-[#6b7280]">
                <strong>Stock:</strong> {product.stock} units
              </div>
              <div className="text-sm text-[#6b7280]">
                <strong>Category:</strong> {product.category}
              </div>
            </div>
          </div>
          {/* Edit and Delete Buttons are removed from here */}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
          {/* Left Column */}
          <div>
            {/* Product Image */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
              <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-[#e5e7eb] overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">📦</div> 
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Product Description</h2>
              <p className="text-sm text-[#4b5563] leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Product Info */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4">💰 Product Details</h2>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-[#6b7280]">Price</span>
                <span className="text-lg font-bold text-[#667eea]">
                  ₹{product.price} {/* Added currency symbol */}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-[#6b7280]">Stock</span>
                <span className="text-sm font-semibold text-[#374151]">{product.stock} units</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-[#6b7280]">Category</span>
                <span className="text-sm font-semibold text-[#374151]">{product.category}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-[#6b7280]">Status</span>
                <span className={`text-sm font-semibold ${product.live ? 'text-[#10b981]' : 'text-[#6b7280]'}`}>
                  {product.live ? 'Live' : 'Not Live'}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-[#6b7280]">Last Updated</span>
                <span className="text-sm font-semibold text-[#374151]">{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal is removed */}
      </div>
    </div>
  );
};

export default UserProductDetailPage;