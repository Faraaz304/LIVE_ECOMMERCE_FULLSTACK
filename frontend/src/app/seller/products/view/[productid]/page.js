'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For Modal only

// Import our new components
import ProductStateWrapper from '@/components/products/ProductStateWrapper';
import ProductHeader from '@/components/products/ProductHeader';
import ProductDetailsGrid from '@/components/products/ProductDetailsGrid';

const SellerProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  const { product, isLoading, error, getProductById, deleteProduct } = useProducts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (productid) getProductById(productid);
  }, [productid, getProductById]);

  const handleDeleteProduct = async () => {

    setShowDeleteModal(false);
    try {
      const result = await deleteProduct(productid);
      if (result.success) {
        setTimeout(() => router.push('/seller/products'), 300);
      } else {
        alert(`Failed to delete product: ${result.error}`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Determine Badge Styling
  const statusLabel = product?.live ? 'Published' : 'Draft';
  const statusColor = product?.live 
    ? "bg-green-500 hover:bg-green-600 text-white border-0 shadow-md" 
    : "bg-secondary text-secondary-foreground";

  return (
    <ProductStateWrapper 
      isLoading={isLoading} 
      error={error} 
      product={product} 
      onBack={() => router.push('/seller/products')}
      backText="Return to Inventory"
    >
      <div className="min-h-screen bg-muted/30 pb-20">
        
        {/* Header with Seller Actions */}
        <ProductHeader 
          title="Product Details" 
          onBack={() => router.back()}
          actionButtons={
            <>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/seller/products/edit/${productid}`)}
                className="bg-background border-border"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </>
          }
        />

        {/* Main Content */}
        {product && (
          <ProductDetailsGrid 
            product={product} 
            statusLabel={statusLabel} 
            statusColor={statusColor} 
          />
        )}

        {/* Delete Modal (Specific to Seller) */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-border shadow-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-xl">Confirm Deletion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to delete <span className="font-bold text-foreground">{product.name}</span>? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProduct}>
                    Confirm Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProductStateWrapper>
  );
};

export default SellerProductDetailPage;