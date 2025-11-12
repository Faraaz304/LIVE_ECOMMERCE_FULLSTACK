// app/(seller)/products/edit/[productid]/page.js
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchById } from '@/hooks/useFetchById'; // Assuming this hook exists
import useUpdateResource from '@/hooks/useUpdateResource'; // Assuming this hook exists
import { useDelete } from '@/hooks/useDelete'; // Assuming this hook exists

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid: routeProductId } = params; // Renamed to avoid confusion with product.id

  // Form states, aligned with API response
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    live: true,
  });

  // State for images: can contain existing image URL or a new File object
  const [images, setImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch product by ID using hook
  const { data: product, loading: isLoading, error: fetchError, refetch } = useFetchById(
    'http://localhost:8082/api/products',
    routeProductId
  );

  // Update product using hook
  const { updateResource, loading: updateLoading, error: updateError } = useUpdateResource();

  // Delete product using hook
  const { deleteItem, loading: deleteLoading, error: deleteError } = useDelete(
    'http://localhost:8082/api/products'
  );

  // Populate form when product data is loaded
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        live: product.live ?? true,
      });

      // Handle existing images
      if (product.imageUrl) {
        setImages([{ url: `http://localhost:8082${product.imageUrl}`, isPrimary: true }]);
      } else {
        setImages([]);
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);

    if (validFiles.length < files.length) {
      alert('Some selected files exceed the 5MB limit and were not added.');
    }

    if (validFiles.length > 0) {
      // For simplicity, we assume one primary image for now.
      // In a multi-image scenario, you'd add to an array and manage primary/secondary.
      setImages([{
        file: validFiles[0], // Store the File object
        url: URL.createObjectURL(validFiles[0]), // For preview
        isPrimary: true,
      }]);
    }
  };

  const setPrimaryImage = (index) => {
    // For single image scenario, this simply marks the current as primary (always true if only one)
    setImages((prevImages) =>
      prevImages.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      // If the removed image was primary, make the first remaining image primary
      if (prevImages[index]?.isPrimary && updatedImages.length > 0) {
        updatedImages[0] = { ...updatedImages[0], isPrimary: true };
      }
      return updatedImages;
    });
  };

  // --- Preview states ---
  const previewName = formData.name || 'Product Name';
  const previewPrice = formData.price ? `₹${new Intl.NumberFormat('en-IN').format(formData.price)}` : '₹0.00';
  const previewStatus = formData.live && formData.stock > 0 ? 'Active' : 'Inactive';
  const primaryImageUrl = images.find(img => img.isPrimary)?.url || '';
  const previewDescriptionSnippet = formData.description ? formData.description.substring(0, 150) + (formData.description.length > 150 ? '...' : '') : 'No description provided.';
  const totalStock = formData.stock;

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    if (images.length === 0) {
      setSubmitError('Please upload at least one image.');
      return;
    }
    const primaryImageObject = images.find(img => img.isPrimary);
    if (!primaryImageObject) {
      setSubmitError('Please set a primary image.');
      return;
    }

    setIsSubmitting(true);

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      live: formData.live,
      stock: parseInt(formData.stock),
    };

    // Prepare payload object for the hook
    const updatePayload = {
      product: productPayload,
      image: primaryImageObject.file || null // Pass the file or null if using existing image
    };

    try {
      await updateResource(
        `http://localhost:8082/api/products/${routeProductId}`,
        updatePayload,
        { isFormData: true } // Indicate that we're sending FormData
      );

      setSubmitSuccess(true);
      alert('Product updated successfully!');
      setTimeout(() => router.push('/seller/products'), 1500); // Updated route
    } catch (err) {
      console.error('Failed to update product:', err);
      setSubmitError(err.message || 'Failed to update product. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    setShowDeleteModal(false);
    setSubmitError(null);

    try {
      await deleteItem(routeProductId);
      alert(`Product "${formData.name || routeProductId}" deleted successfully!`);
      setTimeout(() => router.push('/seller/products'), 500); // Updated route
    } catch (err) {
      console.error('Error deleting product:', err);
      setSubmitError(err.message || 'Failed to delete product.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#6b7280]">Loading product details...</p>
      </div>
    );
  }

  // Handle case where product is null after loading (e.g., 404)
  if (!product && !isLoading && !fetchError) {
    return (
      <div className="p-8 flex-1 bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-[#ef4444] mb-4">Product not found.</p>
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

  if (fetchError && !isSubmitting && !deleteLoading) {
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
            disabled={isSubmitting || deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : '🗑️ Delete'}
          </button>
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
                  placeholder="e.g., iPhone 16"
                  maxLength="100"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || deleteLoading}
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
                  disabled={isSubmitting || deleteLoading}
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
                      <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Set as primary"
                        onClick={() => setPrimaryImage(index)}
                        disabled={isSubmitting || deleteLoading}
                      >
                        {image.isPrimary ? '⭐' : '☆'}
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center text-xs"
                        title="Delete"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting || deleteLoading}
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
                    className={`aspect-square border-2 border-dashed border-[#e5e7eb] rounded-lg bg-gray-50 flex items-center justify-center text-3xl text-[#9ca3af] cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea] hover:bg-[#667eea]/[0.02] ${isSubmitting || deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !(isSubmitting || deleteLoading) && document.getElementById('fileInput').click()}
                  >
                    +
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={isSubmitting || deleteLoading}
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
                  Price (₹) <span className="text-[#ef4444]">*</span>
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
                  disabled={isSubmitting || deleteLoading}
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
                  disabled={isSubmitting || deleteLoading}
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
                  disabled={isSubmitting || deleteLoading}
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
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
                  '📦'
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
                      disabled={isSubmitting || deleteLoading}
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

        {/* Display errors */}
        {(submitError || updateError || deleteError) && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mt-4 text-center">
            {submitError || updateError || deleteError}
          </div>
        )}

        {/* Display success */}
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
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all border-2 border-[#e5e7eb] text-[#374151] hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => router.push('/seller/products')} // Updated route
              disabled={isSubmitting || deleteLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all bg-gray-100 text-[#4b5563] hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => console.log('Save as Draft clicked')}
              disabled={isSubmitting || deleteLoading}
            >
              Save as Draft
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              disabled={isSubmitting || deleteLoading || updateLoading}
            >
              {isSubmitting || updateLoading ? 'Updating Product...' : 'Update Product'}
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
              Are you sure you want to delete "{formData.name || 'this product'}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50 disabled:opacity-70"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer bg-[#ef4444] text-white hover:bg-[#dc2626] disabled:opacity-70"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;