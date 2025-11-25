import React from 'react';
import ProductCard from '@/components/products/productCard';

const ProductGridView = ({ products, basePath }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          basePath={basePath}
        />
      ))}
    </div>
  );
};

export default ProductGridView;