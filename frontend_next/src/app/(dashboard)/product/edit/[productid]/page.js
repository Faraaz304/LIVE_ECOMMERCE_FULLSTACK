'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // For App Router dynamic params and navigation

// NO METADATA EXPORT IN THIS FILE, as requested.
// export const metadata = {
//   title: 'Edit Product - ShopLive Seller',
//   description: 'Edit your product details on ShopLive Seller Dashboard',
// };

// Dummy product data for demonstration
const dummyProduct = {
  id: 'GN-22K-001',
  name: '22K Gold Traditional Necklace Set',
  description:
    'Exquisite 22K gold traditional necklace set crafted with intricate South Indian temple designs. Features detailed goddess motifs and kemp stone embellishments. Perfect for weddings and special occasions. Comes with matching earrings and elegant packaging. Hallmarked for purity and authenticity.',
  sku: 'GN-22K-001',
  barcode: '8901234567890',
  regularPrice: 245000,
  salePrice: 220000,
  costPrice: 200000,
  gstRate: '3',
  stockQuantity: 3,
  lowStockAlert: 2,
  stockStatus: 'in-stock',
  category: 'necklaces',
  tags: 'gold, traditional, wedding, kemp stone',
  productWeight: 45.5,
  productKarat: '22K',
  productPurity: 91.6,
  isFeatured: true,
  isVisible: true,
  images: [
    { url: '/images/product-necklace1.jpg', isPrimary: true, emoji: '💎' }, // Placeholder for actual image
    { url: '/images/product-necklace2.jpg', isPrimary: false, emoji: '💍' },
    { url: '/images/product-earrings.jpg', isPrimary: false, emoji: '👂' },
  ],
  performance: {
    totalViews: '2,547',
    timesPinned: 18,
    reservationsGenerated: 12,
    conversionRate: '4.7%',
  },
  lastUpdated: '2 days ago',
};

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams(); // Get dynamic parameters from URL
  const { productId: routeProductId } = params; // Extract productId from params

  // State for form fields, initialized with dummy data
  const [productName, setProductName] = useState(dummyProduct.name);
  const [description, setDescription] = useState(dummyProduct.description);
  const [sku, setSku] = useState(dummyProduct.sku);
  const [barcode, setBarcode] = useState(dummyProduct.barcode);
  const [regularPrice, setRegularPrice] = useState(dummyProduct.regularPrice);
  const [salePrice, setSalePrice] = useState(dummyProduct.salePrice);
  const [costPrice, setCostPrice] = useState(dummyProduct.costPrice);
  const [gstRate, setGstRate] = useState(dummyProduct.gstRate);
  const [stockQuantity, setStockQuantity] = useState(dummyProduct.stockQuantity);
  const [lowStockAlert, setLowStockAlert] = useState(dummyProduct.lowStockAlert);
  const [stockStatus, setStockStatus] = useState(dummyProduct.stockStatus);
  const [category, setCategory] = useState(dummyProduct.category);
  const [tags, setTags] = useState(dummyProduct.tags);
  const [productWeight, setProductWeight] = useState(dummyProduct.productWeight);
  const [productKarat, setProductKarat] = useState(dummyProduct.productKarat);
  const [productPurity, setProductPurity] = useState(dummyProduct.productPurity);
  const [isFeatured, setIsFeatured] = useState(dummyProduct.isFeatured);
  const [isVisible, setIsVisible] = useState(dummyProduct.isVisible);

  // State for image uploads
  const [images, setImages] = useState(dummyProduct.images); // Array of { url, isPrimary, file? }
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Preview states
  const previewName = productName || 'New Product Name';
  const previewPrice = regularPrice ? `₹${new Intl.NumberFormat('en-IN').format(regularPrice)}` : '₹0.00';
  const previewOriginalPrice = salePrice && salePrice < regularPrice ? `₹${new Intl.NumberFormat('en-IN').format(regularPrice)}` : '';
  const previewDiscount = salePrice && regularPrice && salePrice < regularPrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  const previewKarat = productKarat || 'N/A';
  const previewWeight = productWeight ? `${productWeight}g` : 'N/A';
  const previewPurity = productPurity ? `${productPurity}% Pure` : 'N/A';
  const previewStatus = isVisible && stockQuantity > 0 ? 'Active' : 'Inactive';
  const primaryImageUrl = images.find(img => img.isPrimary)?.url || '';
  const previewDescriptionSnippet = description ? description.substring(0, 150) + (description.length > 150 ? '...' : '') : 'No description provided.';
  const totalStock = stockQuantity;


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: images.length === 0 && files[0] === file, // First uploaded image is primary if none exist
      emoji: '🖼️', // Placeholder if no actual image URL
    }));
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5)); // Limit to 5 images
  };

  const setPrimaryImage = (index) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (prevImages[index].isPrimary && updatedImages.length > 0) {
        // If primary image was removed, set the first remaining image as primary
        updatedImages[0].isPrimary = true;
      }
      return updatedImages;
    });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    console.log('Product updated:', {
      routeProductId, // The ID from the URL
      productName,
      description,
      sku,
      barcode,
      regularPrice,
      salePrice,
      costPrice,
      gstRate,
      stockQuantity,
      lowStockAlert,
      stockStatus,
      category,
      tags,
      productWeight,
      productKarat,
      productPurity,
      isFeatured,
      isVisible,
      images: images.map(img => img.file ? img.file.name : img.url), // In real app, send actual files or URLs
    });
    // Add API call to update product
    alert('Product details updated (logged to console).');
    // router.push('/products'); // Redirect to products list
  };

  const handleDuplicateProduct = () => {
    console.log('Duplicating product:', routeProductId);
    alert('Duplicate product functionality not implemented.');
  };

  const handleDeleteProduct = () => {
    console.log('Deleting product:', routeProductId);
    // Add API call to delete product
    alert('Product deleted (functionality not implemented).');
    setShowDeleteModal(false);
    // router.push('/products'); // Redirect to products list after deletion
  };

  const handleViewLive = () => {
    console.log('Viewing product live...');
    alert('View live functionality not implemented.');
  };

  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header with Actions */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#111827] mb-1">Edit Product</h1>
          <p className="text-base text-[#6b7280]">Product ID: {routeProductId}</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:flex-row flex-col">
          <button
            onClick={handleViewLive}
            className="py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50 flex items-center gap-1"
          >
            👁️ View Live
          </button>
          <button
            onClick={handleDuplicateProduct}
            className="py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50 flex items-center gap-1"
          >
            📋 Duplicate
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all border-2 border-[#fecaca] bg-white text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-1"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Performance Stats Banner */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-6">
        <h3 className="text-base font-bold text-[#111827] mb-4">📊 Product Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#667eea] mb-1">{dummyProduct.performance.totalViews}</div>
            <div className="text-sm text-[#6b7280]">Total Views (30 days)</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#667eea] mb-1">{dummyProduct.performance.timesPinned}</div>
            <div className="text-sm text-[#6b7280]">Times Pinned in Streams</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#667eea] mb-1">{dummyProduct.performance.reservationsGenerated}</div>
            <div className="text-sm text-[#6b7280]">Reservations Generated</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#667eea] mb-1">{dummyProduct.performance.conversionRate}</div>
            <div className="text-sm text-[#6b7280]">Conversion Rate</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdateProduct}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Form (Left Column) */}
          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📝 Basic Information</h2>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Product Name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="e.g., 22K Gold Traditional Necklace Set"
                  maxLength="100"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {productName.length} / 100 characters
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Product Description <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm min-h-[120px] resize-y transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="Describe your product in detail... Include material, craftsmanship, design inspiration, etc."
                  maxLength="1000"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <div className="text-xs text-[#6b7280] mt-1">
                  Write a compelling description that highlights the unique features of your jewelry
                </div>
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {description.length} / 1000 characters
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-0 sm:mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    SKU / Product Code
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-gray-100 text-[#6b7280] transition-all"
                    value={sku}
                    readOnly // SKU is often not editable
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Auto-generated SKU</div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Barcode <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="1234567890123"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📸 Product Images</h2>
              <p className="text-sm text-[#6b7280] mb-4 -mt-3">Manage your product images</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square border-2 border-[#e5e7eb] rounded-lg overflow-hidden bg-gray-50">
                    {image.url ? (
                        <img src={image.url} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">{image.emoji}</div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Set as primary"
                        onClick={() => setPrimaryImage(index)}
                      >
                        {image.isPrimary ? '⭐' : '☆'}
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Delete"
                        onClick={() => removeImage(index)}
                      >
                        🗑️
                      </button>
                    </div>
                    {image.isPrimary && (
                      <div className="absolute bottom-2 left-2 bg-[#667eea] text-white py-1 px-2 rounded-md text-xs font-semibold">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <div
                    className="aspect-square border-2 border-dashed border-[#e5e7eb] rounded-lg bg-gray-50 flex items-center justify-center text-3xl text-[#9ca3af] cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea] hover:bg-[#667eea]/[0.02]"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    +
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
               <div className="text-xs text-[#9ca3af] mt-3 text-center">
                  PNG, JPG, WebP up to 5MB each • Minimum 800x600px • Up to 5 images
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">💰 Pricing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Regular Price (₹) <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="245000"
                    min="0"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    required
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Customer-facing price</div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Sale Price (₹) <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="220000"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Leave blank if no discount</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Cost Price (₹) <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="200000"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                  />
                  <div className="text-xs text-[#6b7280] mt-1">For profit tracking (private)</div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    GST Rate <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    required
                  >
                    <option value="">Select GST Rate</option>
                    <option value="0">0% - No GST</option>
                    <option value="3">3% - Gold Jewelry</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📦 Inventory</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Stock Quantity <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="5"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Current available quantity</div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Low Stock Alert <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="2"
                    min="0"
                    value={lowStockAlert}
                    onChange={(e) => setLowStockAlert(e.target.value)}
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Notify when stock reaches this level</div>
                </div>
              </div>

              <div className="mb-0">
                <label className="block text-sm font-semibold text-[#374151] mb-2">Stock Status</label>
                <select
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="pre-order">Pre-order</option>
                </select>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">🏷️ Organization</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Category <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    id="categorySelect"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="necklaces">Necklace Sets</option>
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="bridal">Bridal Collections</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bangles">Bangles</option>
                    <option value="chains">Chains</option>
                    <option value="pendants">Pendants</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Tags <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="gold, traditional, wedding"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <div className="text-xs text-[#6b7280] mt-1">Comma-separated keywords (e.g., gold, traditional)</div>
                </div>
              </div>

              {/* Jewelry Specific Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Weight (grams) <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="45.5"
                    min="0"
                    value={productWeight}
                    onChange={(e) => setProductWeight(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Karat (e.g., 22K) <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="22K"
                    value={productKarat}
                    onChange={(e) => setProductKarat(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Purity (%) <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="91.6"
                    min="0"
                    max="100"
                    value={productPurity}
                    onChange={(e) => setProductPurity(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Variants (Placeholder for now) */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">✨ Product Variants</h2>
              <p className="text-sm text-[#6b7280] mb-4 -mt-3">
                If your product has different sizes, colors, or materials, add them here.
              </p>              {/* Example Variant Item (can be duplicated by state) */}
              {/* This section would typically involve more complex state management for dynamic fields */}
              <div className="border border-[#e5e7eb] rounded-lg p-4 mb-3 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-[#374151]">Variant 1: Size S, Gold</span>
                  <button type="button" className="text-[#ef4444] text-sm hover:underline">
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-0">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">Option Name</label>
                    <input type="text" className="w-full py-2 px-3 border-2 border-[#e5e7eb] rounded-lg text-sm" value="Size" readOnly />
                  </div>
                  <div className="mb-0">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">Option Value</label>
                    <input type="text" className="w-full py-2 px-3 border-2 border-[#e5e7eb] rounded-lg text-sm" value="S" readOnly />
                  </div>
                  <div className="mb-0">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">Price (₹)</label>
                    <input type="number" className="w-full py-2 px-3 border-2 border-[#e5e7eb] rounded-lg text-sm" value="250000" readOnly />
                  </div>
                  <div className="mb-0">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">Stock</label>
                    <input type="number" className="w-full py-2 px-3 border-2 border-[#e5e7eb] rounded-lg text-sm" value="2" readOnly />
                  </div>
                </div>
              </div>
              {/* End Example Variant */}

              <button
                type="button"
                className="w-full py-3 border-2 border-dashed border-[#e5e7eb] rounded-lg text-[#667eea] font-semibold cursor-pointer transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.02]"
                onClick={() => console.log('Add Variant clicked')}
              >
                + Add Another Variant
              </button>
            </div>
          </div>

          {/* Sidebar Preview (Right Column) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-5">
              <h2 className="text-base font-bold text-[#111827] mb-4">Product Preview</h2>
              <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-6xl mb-4">
                {primaryImageUrl ? (
                  <img src={primaryImageUrl} alt="Product Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '💎'
                )}
              </div>
              <h3 className="text-base font-semibold text-[#374151] mb-2">{previewName}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl font-bold text-[#667eea]">{previewPrice}</div>
                {previewOriginalPrice && (
                    <div className="text-base text-[#9ca3af] line-through">{previewOriginalPrice}</div>
                )}
              </div>
              {previewDiscount > 0 && (
                <div className="bg-[#fef2f2] text-[#dc2626] py-1 px-2 rounded-md text-xs font-semibold inline-block mb-3">
                    {previewDiscount}% OFF
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {productKarat && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{previewKarat}</span>}
                {productWeight && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{previewWeight}</span>}
                {productPurity && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{previewPurity}</span>}
                {category && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{category}</span>}
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{previewDescriptionSnippet}</p>

              <div className="py-2 px-3 bg-gray-50 rounded-lg text-sm text-[#6b7280] mb-4 text-center">
                Stock: <strong className="text-[#374151]">{totalStock}</strong>
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
                <div className="text-sm font-semibold text-[#374151] mb-3">Visibility Settings</div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-[#374151]">Show on ShopLive</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                    />
                    <div
                      className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: isVisible ? '#667eea' : '#d1d5db',
                      }}
                    ></div>
                  </label>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    className="w-4 h-4 rounded-sm cursor-pointer accent-[#667eea]"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <label htmlFor="isFeatured" className="text-sm text-[#374151] cursor-pointer">
                    Mark as Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Product Analytics Card (Right Sidebar) */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
                <h4 className="text-sm font-semibold text-[#374151] mb-3">Recent Analytics</h4>
                <div className="py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-[#6b7280]">Total Views</span>
                    <span className="text-sm font-semibold text-[#374151]">2,547</span>
                </div>
                <div className="py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-[#6b7280]">Last 7 days views</span>
                    <span className="text-sm font-semibold text-[#374151]">450</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                    <span className="text-xs text-[#6b7280]">Total Reservations</span>
                    <span className="text-sm font-semibold text-[#374151]">12</span>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] p-5 flex justify-between items-center z-20">
          <div className="flex gap-3">
            <button
              type="button"
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all border-2 border-[#e5e7eb] text-[#374151] hover:bg-gray-50"
              onClick={() => router.push('/products')} // Navigate back to products list
            >
              Cancel
            </button>
            <button
              type="button"
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all bg-gray-100 text-[#4b5563] hover:bg-gray-200"
              onClick={() => console.log('Save as Draft clicked')}
            >
              Save as Draft
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              Update Product
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-xl font-bold text-[#111827] mb-3">Confirm Deletion</h3>
            <p className="text-sm text-[#6b7280] mb-6">
              Are you sure you want to delete "22K Gold Traditional Necklace Set"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer bg-[#ef4444] text-white hover:bg-[#dc2626]"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;