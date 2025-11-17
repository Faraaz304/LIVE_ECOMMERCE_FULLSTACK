'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

// Import the reusable components
import ProductForm from '@/components/products/ProductForm';
import ProductPreviewSidebar from '@/components/products/ProductPreviewSidebar';


const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid: routeProductId } = params;

  const {
    product,
    isLoading, // This isLoading is for fetching the product
    error: fetchError,
    getProductById,
    updateProduct,
    deleteProduct,
    // Note: useProducts might have its own `isUpdating` or `isDeleting` states.
    // We'll use the local `isLoading` and `deleteLoading` for better control here.
  } = useProducts();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    live: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Separate loading flag for update and delete operations
  const [isUpdating, setIsUpdating] = useState(false); // New state for update submission
  const [deleteLoading, setDeleteLoading] = useState(false);


  // Fetch product on mount
  useEffect(() => {
    if (routeProductId) {
      getProductById(routeProductId);
    }
  }, [routeProductId, getProductById]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.rawPrice ?? '', // Use rawPrice if available, otherwise just price (ensure consistency)
        stock: product.stock ?? '',
        category: product.category || '',
        live: product.live ?? true,
      });

      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        setImageFile(null);
        // Do not clear existing imagePreview if a new file failed size check, only if it was empty initially
        if (!product?.imageUrl) setImagePreview(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      // If the user clears the input, clear the preview unless there was an original image
      if (!product?.imageUrl) {
        setImagePreview(null);
      } else {
        setImagePreview(product.imageUrl); // Revert to original image if file input is cleared
      }
    }
  };


  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsUpdating(true); // Start update loading

    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      setSubmitError('Please fill in all required fields.');
      setIsUpdating(false);
      return;
    }

    const productPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category: formData.category.trim(),
      live: formData.live,
    };

    try {
      const result = await updateProduct(routeProductId, productPayload, imageFile);
      if (result && result.success) { // Check for result and its success property
        setSubmitSuccess(true);
        // alert('Product updated successfully!'); // You might remove this if success message is good enough
        setTimeout(() => router.push('/seller/products'), 1500);
      } else {
        setSubmitError(result?.error || 'Failed to update product. Please try again.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setSubmitError(err.message || 'An unexpected error occurred during update.');
    } finally {
      setIsUpdating(false); // Stop update loading
    }
  };

  const handleDeleteProduct = async () => {
    setShowDeleteModal(false);
    setSubmitError(null);
    setDeleteLoading(true);

    try {
      const result = await deleteProduct(routeProductId);
      if (result && result.success) {
        alert(`Product "${formData.name}" deleted successfully!`);
        setTimeout(() => router.push('/seller/products'), 500);
      } else {
        setSubmitError(result?.error || 'Failed to delete product. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setSubmitError(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Show loading state for initial product fetch
  if (isLoading) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#6b7280]">Loading product details...</p>
      </div>
    );
  }

  // Handle cases where product is null after loading (e.g., 404)
  // Only show this if not currently fetching AND product is null AND there's no fetch error.
  // If there's a fetchError, that will be handled separately.
  if (!product && !isLoading && !fetchError) {
    return (
      <div className="p-8 flex-1 bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Product not found.</div>
          <p className="text-[#ef4444] mb-4">The product with ID "{routeProductId}" could not be found.</p>
          <button
            onClick={() => router.push('/seller/products')}
            className="py-2 px-4 bg-[#667eea] text-white rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Handle API fetch errors
  if (fetchError && !isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <div className="max-w-[1400px] mx-auto p-8 flex items-center justify-center">
          <p className="text-xl text-[#ef4444]">Error loading product: {fetchError}</p>
          <button
            onClick={() => router.push('/seller/products')}
            className="ml-4 py-2 px-4 bg-[#667eea] text-white rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Page Header with Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#111827] mb-1">Edit Product</h1>
            <p className="text-base text-[#6b7280]">Product ID: {routeProductId}</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:flex-row flex-col">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              disabled={isUpdating || deleteLoading} // Disable if updating or deleting
              className="border-2 border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2]"
            >
              Delete
            </Button>
          </div>
        </div>

        <form onSubmit={handleUpdateProduct}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Main Form (Left Column) - Reusing ProductForm */}
            <ProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              setImageFile={setImageFile}
              setImagePreview={setImagePreview}
              isLoading={isUpdating} // Pass the isUpdating state to disable inputs
            />

            {/* Sidebar Preview (Right Column) - Reusing ProductPreviewSidebar */}
            <ProductPreviewSidebar
              formData={formData}
              imagePreview={imagePreview}
              handleInputChange={handleInputChange} // For the visibility toggle within the sidebar
              isLoading={isUpdating} // Pass the isUpdating state to disable toggle
            />
          </div>

          {/* Display messages */}
          {submitError && (
            <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mt-4 text-center">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mt-4 text-center">
              Product updated successfully! Redirecting...
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="bg-white border-t border-[#e5e7eb] p-5 flex justify-between items-center mt-6 rounded-xl">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/seller/products')}
                disabled={isUpdating || deleteLoading}
              >
                Cancel
              </Button>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
              disabled={isUpdating || deleteLoading}
            >
              {isUpdating ? 'Updating Product...' : 'Update Product'}
            </Button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
              <h3 className="text-xl font-bold text-[#111827] mb-3">Confirm Deletion</h3>
              <p className="text-sm text-[#6b7280] mb-6">
                Are you sure you want to delete "{formData.name || 'this product'}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#ef4444] hover:bg-[#dc2626]"
                  onClick={handleDeleteProduct}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;