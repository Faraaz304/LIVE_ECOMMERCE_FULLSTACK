'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts'; 

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Using native textarea with Tailwind styling 

const AddProductPage = () => {
  const router = useRouter();
  // Use the createProduct function and states from the useProducts hook
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

  // Define preview values from formData
  const previewName = formData.name || 'Product Name';
  const previewPrice = formData.price ? `₹${parseFloat(formData.price).toLocaleString('en-IN')}` : '₹0';
  const previewStatus = formData.live ? 'Active' : 'Inactive';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for Shadcn Select component
  const handleSelectChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for Shadcn Checkbox component
  const handleCheckboxChange = (checked, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
      if (result.success) {
        setSuccess(true);
        alert('Product added successfully!');
        setTimeout(() => router.push('/seller/products'), 1500); // Updated route
      } else {
        alert(`Failed to add product: ${result.error}`);
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
          {/* Main Form (Left Column) */}
          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📝 Basic Information</h2>
              <div className="text-sm text-[#6b7280] mb-4 -mt-3">Provide essential details about your product.</div>

              <div className="mb-5">
                <label htmlFor="productName" className="block text-sm font-semibold text-[#374151] mb-2">
                  Product Name <span className="text-[#ef4444]">*</span>
                </label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="e.g., 22K Gold Traditional Necklace Set"
                  maxLength="100"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {formData.name.length} / 100 characters
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="productDescription" className="block text-sm font-semibold text-[#374151] mb-2">
                  Product Description <span className="text-[#ef4444]">*</span>
                </label>
                {/* Using native textarea with Tailwind classes, replace with Shadcn Textarea if available */}
                <textarea
                  id="productDescription"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm min-h-[120px] resize-y transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="Describe your product in detail... Include material, craftsmanship, design inspiration, etc."
                  maxLength="1000"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <div className="text-xs text-[#6b7280] mt-1">
                  Write a compelling description that highlights the unique features
                </div>
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {formData.description.length} / 1000 characters
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📸 Product Images</h2>
              <p className="text-sm text-[#6b7280] mb-4 -mt-3">Upload high-quality images of your product</p>

              <div
                className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-8 text-center bg-gray-50 cursor-pointer transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="text-5xl mb-3">🖼️</div>
                <div className="text-base font-semibold text-[#374151] mb-1">Drag & Drop Images Here</div>
                <div className="text-sm text-[#6b7280] mb-3">or click to browse</div>
                <Button
                  type="button"
                  // Remove inline style, use Tailwind/Shadcn defaults or custom classes
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
                >
                  Choose Files
                </Button>
                <div className="text-xs text-[#9ca3af] mt-3">
                  PNG, JPG, WebP up to 5MB each • Minimum 800x600px
                </div>
                <Input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <div className="relative aspect-square border-2 border-[#e5e7eb] rounded-lg overflow-hidden bg-gray-50 w-40">
                    <img src={imagePreview} alt="Product Image" className="w-full h-full object-cover rounded-lg" />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs absolute top-2 right-2 hover:bg-red-100 hover:text-red-600"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">💰 Pricing</h2>

              <div className="mb-5">
                <label htmlFor="productPrice" className="block text-sm font-semibold text-[#374151] mb-2">
                  Regular Price (₹) <span className="text-[#ef4444]">*</span>
                </label>
                <Input
                  type="number"
                  id="productPrice"
                  placeholder="245000"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <div className="text-xs text-[#6b7280] mt-1">Customer-facing price</div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📦 Inventory</h2>

              <div className="mb-5">
                <label htmlFor="productStock" className="block text-sm font-semibold text-[#374151] mb-2">
                  Stock Quantity <span className="text-[#ef4444]">*</span>
                </label>
                <Input
                  type="number"
                  id="productStock"
                  placeholder="5"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
                <div className="text-xs text-[#6b7280] mt-1">Current available quantity</div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">🏷️ Organization</h2>

              <div className="mb-5">
                <label htmlFor="productCategory" className="block text-sm font-semibold text-[#374151] mb-2">
                  Category <span className="text-[#ef4444]">*</span>
                </label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                  required
                >
                  <SelectTrigger id="productCategory" className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Necklace Sets">Electronics</SelectItem>
                    <SelectItem value="Rings">jewelry</SelectItem>
                    <SelectItem value="Earrings">kictchen</SelectItem>
                    <SelectItem value="Bridal Collections">Bridal Collections</SelectItem>
                    <SelectItem value="Bracelets">Cosmetics</SelectItem>
                    <SelectItem value="Bangles">Stationary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sidebar Preview (Right Column) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-base font-bold text-[#111827] mb-4">Product Preview</h2>
              <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-6xl mb-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Product Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '💎'
                )}
              </div>
              <h3 className="text-base font-semibold text-[#374151] mb-2">{previewName}</h3>
              <div className="text-2xl font-bold text-[#667eea] mb-3">{previewPrice}</div>
              <div className="flex flex-wrap gap-2 mb-3 text-xs">
                {formData.category && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{formData.category}</span>}
              </div>
              <div
                className={`py-2 px-3 rounded-lg text-sm font-semibold text-center ${
                  previewStatus === 'Active'
                    ? 'bg-[#d1fae5] text-[#065f46]'
                    : 'bg-gray-100 text-[#4b5563]'
                }`}
              >
                {previewStatus}
              </div>

              <div className="mt-5 pt-5 border-t border-[#e5e7eb]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#374151]">Product Visibility</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      name="live"
                      checked={formData.live}
                      onChange={handleInputChange}
                    />
                    <div
                      className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: formData.live ? '#667eea' : '#d1d5db',
                      }}
                    ></div>
                  </label>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-lg" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                <h5 className="text-xs font-semibold text-[#667eea] mb-2">💡 Tips for a great listing</h5>
                <ul className="list-disc list-inside text-xs text-[#6b7280] leading-relaxed">
                  <li>Use clear, bright images.</li>
                  <li>Write detailed, accurate descriptions.</li>
                  <li>Set competitive pricing.</li>
                  <li>Keep inventory updated.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Display success message */}
        {success && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mt-4 text-center">
            ✅ Product added successfully! Redirecting...
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="bg-white border-t border-[#e5e7eb] p-5 flex justify-between items-center mt-6 rounded-xl">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/seller/products')} 
              disabled={isLoading} // Use isLoading from the hook
            >
              Cancel
            </Button>
          </div>
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
            disabled={isLoading} // Use isLoading from the hook
          >
           add product 
          </Button>
        </div>

        
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;