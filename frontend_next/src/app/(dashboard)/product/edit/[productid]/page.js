// app/product/edit/[productId]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// NO METADATA EXPORT IN THIS FILE, as requested.

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productId: routeProductId } = params;

  // Form states, aligned with API response
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '', // Number
    stock: '', // Number
    category: '',
    live: true, // Maps to isVisible
  });

  // State for images: can contain existing image URL or a new File object
  const [images, setImages] = useState([]); // Array of { file?, url, isPrimary }
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // For initial data fetch
  const [fetchError, setFetchError] = useState(null); // For initial data fetch error
  const [isSubmitting, setIsSubmitting] = useState(false); // For PUT operation
  const [isDeleting, setIsDeleting] = useState(false); // For DELETE operation
  const [submitSuccess, setSubmitSuccess] = useState(false); // For PUT operation success feedback
  const [submitError, setSubmitError] = useState(null); // For PUT/DELETE operation error feedback


  // --- Data Fetching Effect for existing product ---
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(`http://localhost:8082/api/products/${routeProductId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Populate form data from fetched product, only for fields API provides
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          stock: data.stock || '',
          category: data.category || '',
          live: data.live ?? true, // maps to isVisible
        });

        // Handle existing images: If imageUrl exists, set it as the primary image
        if (data.imageUrl) {
          setImages([{ url: `http://localhost:8082${data.imageUrl}`, isPrimary: true }]);
        } else {
            setImages([]); // No existing image
        }

      } catch (err) {
        console.error('Failed to fetch product for editing:', err);
        setFetchError(err.message || 'Failed to load product details for editing.');
      } finally {
        setIsLoading(false);
      }
    };

    if (routeProductId) {
      fetchProductData();
    }
  }, [routeProductId]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);

    if (validFiles.length < files.length) {
      alert('Some selected files exceed the 5MB limit and were not added.');
    }

    // For editing, usually only one main image is updated.
    // Replace existing images array with the new primary one if a valid file is uploaded.
    if (validFiles.length > 0) {
        setImages([{
            file: validFiles[0],
            url: URL.createObjectURL(validFiles[0]),
            isPrimary: true,
        }]);
    }
  };

  // Keep setPrimaryImage and removeImage, though in this simplified single-image model,
  // setPrimaryImage mostly ensures the only image is primary, and removeImage clears it.
  const setPrimaryImage = (index) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (prevImages[index]?.isPrimary && updatedImages.length > 0) {
        updatedImages[0].isPrimary = true; // Set new primary if old one was removed
      }
      return updatedImages;
    });
  };


  // --- Preview states ---
  const previewName = formData.name || 'Product Name';
  const previewPrice = formData.price ? `₹${new Intl.NumberFormat('en-IN').format(formData.price)}` : '₹0.00';
  // Removed salePrice, costPrice, gstRate, tags, productWeight, productKarat, productPurity from preview
  const previewStatus = formData.live && formData.stock > 0 ? 'Active' : 'Inactive';
  const primaryImageUrl = images.find(img => img.isPrimary)?.url || '';
  const previewDescriptionSnippet = formData.description ? formData.description.substring(0, 150) + (formData.description.length > 150 ? '...' : '') : 'No description provided.';
  const totalStock = formData.stock;


  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      setSubmitError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    if (images.length === 0) {
        setSubmitError('Please upload at least one image.');
        setIsSubmitting(false);
        return;
    }
    const primaryImageObject = images.find(img => img.isPrimary);
    if (!primaryImageObject) {
        setSubmitError('Please set a primary image.');
        setIsSubmitting(false);
        return;
    }


    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      live: formData.live,
      stock: parseInt(formData.stock),
      // Only include fields that your API actually expects for PUT
      // Based on your JSON, SKU, Barcode, etc. are not updated via the product JSON string
      // If backend requires them for PUT, ensure they are in formData and added here.
      // For this example, sticking to the "iPhone 16" JSON you provided for PUT.
    };

    const formDataToSend = new FormData();
    formDataToSend.append('product', JSON.stringify(productPayload));

    // Only append the 'image' field if a new file was selected as primary (has 'file' property)
    // If an existing image URL is primary, we don't send a new file; backend retains old image.
    if (primaryImageObject.file) { // Check if it's a new file, not just an existing URL
      formDataToSend.append('image', primaryImageObject.file);
    }

    try {
      const response = await fetch(`http://localhost:8082/api/products/${routeProductId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const responseText = await response.text(); // Read as text first
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Backend responded with non-JSON text on PUT:', responseText, parseError);
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Server error: ${response.status} ${response.statusText}. Response body: ${responseText}`);
      }

      if (result) {
        console.log('Product updated successfully:', result);
      } else {
        console.log('Product updated successfully (HTTP 200 OK), but no JSON data was returned in the response body.');
      }

      setSubmitSuccess(true);
      alert('Product updated successfully!');
      router.push('/product'); // Redirect to products list page

    } catch (err) {
      console.error('Failed to update product:', err);
      setSubmitError(err.message || 'Failed to update product. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicateProduct = () => {
    console.log('Duplicating product:', routeProductId);
    alert('Duplicate product functionality not implemented.');
  };

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    setSubmitError(null);
    setShowDeleteModal(false); // Close the modal immediately

    try {
      const response = await fetch(`http://localhost:8082/api/products/${routeProductId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to delete product. Server responded with status ${response.status}.`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (parseError) {
          errorMessage = `${errorMessage} Body: ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      console.log(`Product ${routeProductId} deleted successfully.`);
      alert(`Product "${formData.name || routeProductId}" deleted successfully!`);
      router.push('/product'); // Redirect to products list page after deletion

    } catch (err) {
      console.error('Error deleting product:', err);
      setSubmitError(err.message || 'Failed to delete product.');
      alert(`Error deleting product: ${err.message}`); // Provide immediate feedback
    } finally {
      setIsDeleting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#6b7280]">Loading product details...</p>
      </div>
    );
  }

  // Display fetch error if data couldn't be loaded initially
  if (fetchError && !isSubmitting && !isDeleting) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#ef4444]">{fetchError}</p>
      </div>
    );
  }

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
            onClick={() => setShowDeleteModal(true)}
            className="py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all border-2 border-[#fecaca] bg-white text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-1"
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      {/* Performance Stats Banner (still using dummy data for this section as API didn't provide) */}
     

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
                  placeholder="e.g., iPhone 16"
                  maxLength="100"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isDeleting}
                />
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {formData.name.length} / 100 characters
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Product Description <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm min-h-[120px] resize-y transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="Describe your product in detail..."
                  maxLength="1000"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isDeleting}
                ></textarea>
                <div className="text-xs text-[#6b7280] mt-1">
                  Write a compelling description that highlights the unique features of your product
                </div>
                <div className="text-xs text-[#9ca3af] text-right mt-1">
                  {formData.description.length} / 1000 characters
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
                        <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div> // Generic placeholder
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Set as primary"
                        onClick={() => setPrimaryImage(index)}
                        disabled={isSubmitting || isDeleting}
                      >
                        {image.isPrimary ? '⭐' : '☆'}
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Delete"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting || isDeleting}
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
                {images.length < 5 && ( // Allow adding new image only if less than 5
                  <div
                    className={`aspect-square border-2 border-dashed border-[#e5e7eb] rounded-lg bg-gray-50 flex items-center justify-center text-3xl text-[#9ca3af] cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea] hover:bg-[#667eea]/[0.02] ${isSubmitting || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !(isSubmitting || isDeleting) && document.getElementById('fileInput').click()}
                  >
                    +
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      style={{ display: 'none' }} // Remove multiple as per current logic of one primary image at a time for update
                      onChange={handleImageUpload}
                      disabled={isSubmitting || isDeleting}
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

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Price (₹) <span className="text-[#ef4444]">*</span> {/* Changed from Regular Price to just Price */}
                </label>
                <input
                  type="number"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="999.99"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isDeleting}
                />
                <div className="text-xs text-[#6b7280] mt-1">Customer-facing price</div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">📦 Inventory</h2>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Stock Quantity <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="number"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="15"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isDeleting}
                />
                <div className="text-xs text-[#6b7280] mt-1">Current available quantity</div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">🏷️ Organization</h2>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Category <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isDeleting}
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option> {/* Added for iPhone example */}
                  <option value="Necklace Sets">Necklace Sets</option>
                  <option value="Rings">Rings</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bridal Collections">Bridal Collections</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Bangles">Bangles</option>
                  <option value="Chains">Chains</option>
                  <option value="Pendants">Pendants</option>
                  <option value="study">Study</option>
                </select>
              </div>
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
                  '📦' // Generic icon for preview if no image or specific category icon
                )}
              </div>
              <h3 className="text-base font-semibold text-[#374151] mb-2">{previewName}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl font-bold text-[#667eea]">{previewPrice}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {formData.category && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{formData.category}</span>}
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
                      name="live"
                      checked={formData.live}
                      onChange={handleInputChange}
                      disabled={isSubmitting || isDeleting}
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

            {/* Product Analytics Card (Right Sidebar, using static data as API didn't provide) */}
            
          </div>
        </div>

        {/* Display submission/deletion error */}
        {submitError && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mt-4 text-center">
            {submitError}
          </div>
        )}
        {/* Display submission success */}
        {submitSuccess && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mt-4 text-center">
            ✅ Product updated successfully! Redirecting...
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] p-5 flex justify-between items-center z-20">
          <div className="flex gap-3">
            <button
              type="button"
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all border-2 border-[#e5e7eb] text-[#374151] hover:bg-gray-50"
              onClick={() => router.push('/product')} // Navigate back to products list
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all bg-gray-100 text-[#4b5563] hover:bg-gray-200"
              onClick={() => console.log('Save as Draft clicked')} // Functionality for draft
              disabled={isSubmitting || isDeleting}
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
                opacity: (isSubmitting || isDeleting) ? 0.7 : 1,
                cursor: (isSubmitting || isDeleting) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? 'Updating Product...' : 'Update Product'}
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
              Are you sure you want to delete "{(formData.name || 'this product')}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer bg-[#ef4444] text-white hover:bg-[#dc2626]"
                onClick={handleDeleteProduct}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;