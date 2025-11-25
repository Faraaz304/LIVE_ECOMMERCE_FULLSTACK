'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import ProductForm from '@/components/products/ProductForm';
import ProductPreviewSidebar from '@/components/products/ProductPreviewSidebar';

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid: routeProductId } = params;

  const {
    product,
    isLoading,
    error: fetchError,
    getProductById,
    updateProduct,
    deleteProduct,
  } = useProducts();

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
  const [isUpdating, setIsUpdating] = useState(false); 
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (routeProductId) {
      getProductById(routeProductId);
    }
  }, [routeProductId, getProductById]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.rawPrice ?? '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        setImageFile(null);
        if (!product?.imageUrl) setImagePreview(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      if (!product?.imageUrl) {
        setImagePreview(null);
      } else {
        setImagePreview(product.imageUrl);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsUpdating(true); 

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
      if (result && result.success) {
        setSubmitSuccess(true);
        setTimeout(() => router.push('/admin/products'), 1500);
      } else {
        setSubmitError(result?.error || 'Failed to update product. Please try again.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setSubmitError(err.message || 'An unexpected error occurred during update.');
    } finally {
      setIsUpdating(false); 
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-muted/30">
        <p className="text-lg text-muted-foreground animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product && !isLoading && !fetchError) {
    return (
      <div className="h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-foreground">Product not found</div>
          <p className="text-muted-foreground mb-4">The product with ID "{routeProductId}" could not be found.</p>
          <Button onClick={() => router.push('/seller/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  if (fetchError && !isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">Error: {fetchError}</p>
          <Button onClick={() => router.push('/seller/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-30 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Edit Product</h1>
              <p className="text-xs text-muted-foreground">Updating: {formData.name || '...'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              disabled={isUpdating || deleteLoading}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <form onSubmit={handleUpdateProduct}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
               {submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-center">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="bg-green-500/15 border border-green-500/30 text-green-600 rounded-lg p-3 text-center">
                  Product updated successfully! Redirecting...
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
                isLoading={isUpdating}
              />

              <div className="bg-card text-card-foreground border-t border-border p-5 flex justify-end items-center gap-3 mt-6 rounded-xl shadow-sm">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/products')}
                  disabled={isUpdating || deleteLoading}
                  className="bg-background"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[150px]"
                  disabled={isUpdating || deleteLoading}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* Right: Sidebar */}
            <ProductPreviewSidebar
              formData={formData}
              imagePreview={imagePreview}
              handleInputChange={handleInputChange}
              isLoading={isUpdating}
            />
          </div>
        </form>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card text-card-foreground rounded-2xl p-8 max-w-md w-full border border-border shadow-2xl">
              <h3 className="text-xl font-bold text-foreground mb-3">Delete Product?</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{formData.name}"</span>? 
                This action cannot be undone and will remove the product from your store immediately.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="bg-background"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteProduct}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
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