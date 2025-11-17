'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';

// Import the new components
import ProductForm from '@/components/products/ProductForm';
import ProductPreviewSidebar from '@/components/products/ProductPreviewSidebar';

const AddProductPage = () => {
  const router = useRouter();
  const { createProduct, isLoading, error: createError } = useProducts();

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
  const [success, setSuccess] = useState(false);

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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        setImageFile(null); // Clear file selection
        setImagePreview(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // Reset success state on new submission attempt

    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      alert('Please upload a product image');
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
      const result = await createProduct(productPayload, imageFile);
      if (result && result.success) { // Check for result and its success property
        setSuccess(true);
        alert('Product added successfully!');
        setTimeout(() => router.push('/seller/products'), 1500); // Updated route
      } else {
        // Use createError from the hook if available, otherwise a generic message
        alert(`Failed to add product: ${createError || result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('❌ Error adding product (catch block):', err);
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827]">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Left Column (Product Form) */}
            <ProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              setImageFile={setImageFile}
              setImagePreview={setImagePreview}
              isLoading={isLoading}
            />

            {/* Right Column (Product Preview Sidebar) */}
            <ProductPreviewSidebar
              formData={formData}
              imagePreview={imagePreview}
              handleInputChange={handleInputChange} // For the visibility toggle
              isLoading={isLoading}
            />
          </div>

          {/* Display success message */}
          {success && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mt-4 text-center">
              ✅ Product added successfully! Redirecting...
            </div>
          )}
          {/* Display error message from useProducts hook */}
          {createError && (
            <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mt-4 text-center">
              ❌ Error: {createError}
            </div>
          )}


          {/* Bottom Actions Bar */}
          <div className="bg-white border-t border-[#e5e7eb] p-5 flex justify-between items-center mt-6 rounded-xl">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/seller/products')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;