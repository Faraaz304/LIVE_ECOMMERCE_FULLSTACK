'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';

// Import our new components
import ProductStateWrapper from '@/components/products/ProductStateWrapper';
import ProductHeader from '@/components/products/ProductHeader';
import ProductDetailsGrid from '@/components/products/ProductDetailsGrid';

const UserProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  const { product, isLoading, error, getProductById } = useProducts();

  useEffect(() => {
    if (productid) getProductById(productid);
  }, [productid, getProductById]);

  // Determine Badge Styling
  const statusLabel = product?.live ? 'Available' : 'Unavailable';
  const statusColor = product?.live 
    ? "bg-green-500 hover:bg-green-600 text-white border-0 shadow-md" 
    : "bg-secondary text-secondary-foreground";

  return (
    <ProductStateWrapper 
      isLoading={isLoading} 
      error={error} 
      product={product} 
      onBack={() => router.push('/user/products')}
      backText="Back to Products"
    >
      <div className="min-h-screen bg-muted/30 pb-20">
        
        {/* Header (No extra buttons for user) */}
        <ProductHeader 
          title="Product Details" 
          onBack={() => router.back()} 
        />

        {/* Main Content */}
        {product && (
          <ProductDetailsGrid 
            product={product} 
            statusLabel={statusLabel} 
            statusColor={statusColor} 
          />
        )}
      </div>
    </ProductStateWrapper>
  );
};

export default UserProductDetailPage;