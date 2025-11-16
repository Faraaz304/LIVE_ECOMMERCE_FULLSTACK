'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  const { 
    product, 
    isLoading, 
    error, 
    getProductById, 
    deleteProduct 
  } = useProducts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            <Button onClick={() => router.push('/seller/products')}>
              Back to Products
            </Button>
          </div>
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
    router.push(`/seller/products/edit/${productid}`);
  };

  const handleDeleteProduct = async () => {
    setShowDeleteModal(false);
    try {
      const result = await deleteProduct(productid);
      if (result.success) {
        alert('Product deleted successfully');
        setTimeout(() => router.push('/seller/products'), 500);
      } else {
        alert(`Failed to delete product: ${result.error}`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Error deleting product: ${err.message}`);
    }
  };

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
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleEditProduct}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
              disabled={isLoading}
            >
              ✏️ Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="border-2 border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2]"
              disabled={isLoading}
            >
              🗑️ Delete
            </Button>
          </div>
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
                  <div className="text-6xl">�</div>
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
                  {product.price}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
              <h3 className="text-xl font-bold text-[#111827] mb-3">Confirm Deletion</h3>
              <p className="text-sm text-[#6b7280] mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#ef4444] hover:bg-[#dc2626]"
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;