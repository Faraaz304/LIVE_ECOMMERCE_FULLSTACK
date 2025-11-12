import React from 'react';
import ProductCard from './ProductCard'; // Adjusted path

const ProductsGrid = ({ products, selectedProductIds, handleCheckboxChange, currentView }) => {
  return (
    <div
      id="gridView"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8 ${
        currentView === 'grid' ? 'block' : 'hidden'
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selectedProductIds={selectedProductIds}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;