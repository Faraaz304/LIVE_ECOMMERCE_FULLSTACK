// app/(seller)/products/view/[productid]/page.js
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDelete } from '@/hooks/useDelete'; // Assuming this hook exists
import { useFetchAll } from '@/hooks/useFetchAll'; // Assuming this hook can fetch a single item by ID

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  // useState is fine here for managing the local deletion state or modal
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch single product using the hook
  const productUrl = productid ? `http://localhost:8082/api/products/${productid}` : null;
  const { data: product, loading, error } = useFetchAll(productUrl); // Re-using useFetchAll for single item

  // useDelete is correctly used here for seller view
  const { deleteItem, loading: deleteLoading, error: deleteError } = useDelete(
    'http://localhost:8082/api/products'
  );

  if (loading) {
    return (
      <div className="p-8 flex-1 bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-[#6b7280]">Loading product...</p>
        </div>
      </div>
    );
  }

  // Handle case where product is null after loading (e.g., 404)
  if (error || !product) {
    return (
      <div className="p-8 flex-1 bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-[#ef4444] mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/seller/products')} // Updated route
            className="py-2 px-4 bg-[#667eea] text-white rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Added defensive check
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditProduct = () => {
    router.push(`/seller/products/edit/${productid}`); // Updated route
  };

  const handleDeleteProduct = async () => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteItem(productid);
        alert('Product deleted successfully');
        setTimeout(() => router.push('/seller/products'), 500); // Updated route
      } catch (err) {
        console.error('Error deleting product:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">{product.name}</h1>
          <p className="text-sm text-[#6b7280] mb-3">
            ID: {product.id} • Created: {formatDate(product.createdAt)}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                product.live
                  ? 'bg-[#d1fae5] text-[#065f46]'
                  : 'bg-gray-100 text-[#4b5563]'
              }`}
            >
              {product.live ? 'Live' : 'Not Live'}
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
            className="py-3 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            disabled={isDeleting || deleteLoading}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDeleteProduct}
            className="py-3 px-5 bg-white text-[#ef4444] border-2 border-[#fecaca] rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-[#fef2f2] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isDeleting || deleteLoading}
          >
            {deleteLoading ? '⏳' : '🗑️'} {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Error message from delete operation */}
      {deleteError && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mb-4 text-sm">
          ❌ {deleteError}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Left Column */}
        <div>
          {/* Product Image */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-[#e5e7eb] overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={`http://localhost:8082${product.imageUrl}`}
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
                ₹{new Intl.NumberFormat('en-IN').format(product.price)}
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
    </div>
  );
};

export default ProductDetailPage;