'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';

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
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
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
    setSuccess(false);

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
      if (result && result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/seller/products'), 1500);
      } else {
        alert(`Failed to add product: ${createError || result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Product</h1>
              <p className="text-xs text-slate-500">Create a new listing for your inventory</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/seller/products')} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Publish Product</>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-8 space-y-6">
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="bg-emerald-100 p-1 rounded-full">✓</span>
                Product created successfully! Redirecting...
              </div>
            )}
            
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                Error: {createError}
              </div>
            )}

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
          </div>

          {/* Right Column: Preview & Settings */}
          <div className="lg:col-span-4">
             <ProductPreviewSidebar
                formData={formData}
                imagePreview={imagePreview}
                handleInputChange={handleInputChange}
                isLoading={isLoading}
              />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;