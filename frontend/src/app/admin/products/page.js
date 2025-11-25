'use client';

import React from 'react';
import SharedProductList from '@/components/products/SharedProductList';

const AdminProductsPage = () => {
  return <SharedProductList basePath="/admin" />;
};

export default AdminProductsPage;