import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductForm = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  imagePreview,
  setImageFile,
  setImagePreview,
  isLoading,
}) => {
  return (
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
            disabled={isLoading}
          />
          <div className="text-xs text-[#9ca3af] text-right mt-1">
            {formData.name.length} / 100 characters
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="productDescription" className="block text-sm font-semibold text-[#374151] mb-2">
            Product Description <span className="text-[#ef4444]">*</span>
          </label>
          <textarea
            id="productDescription"
            className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm min-h-[120px] resize-y transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
            placeholder="Describe your product in detail... Include material, craftsmanship, design inspiration, etc."
            maxLength="1000"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            disabled={isLoading}
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
          onClick={() => !isLoading && document.getElementById('fileInput').click()}
        >
          <div className="text-5xl mb-3">🖼️</div>
          <div className="text-base font-semibold text-[#374151] mb-1">Drag & Drop Images Here</div>
          <div className="text-sm text-[#6b7280] mb-3">or click to browse</div>
          <Button
            type="button"
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
            disabled={isLoading}
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
            disabled={isLoading}
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
                disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <SelectTrigger id="productCategory" className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Jewelry">Jewelry</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Bridal Collections">Bridal Collections</SelectItem>
              <SelectItem value="Cosmetics">Cosmetics</SelectItem>
              <SelectItem value="Stationary">Stationary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;