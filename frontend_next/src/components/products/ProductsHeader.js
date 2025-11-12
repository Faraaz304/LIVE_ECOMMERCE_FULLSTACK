import React from 'react';
import { useRouter } from 'next/navigation';

const ProductsHeader = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Products</h1>
      </div>
      <button
        className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:-translate-y-px"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
        }}
        onClick={() => router.push('/product/add')}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        ➕ Add Product
      </button>
    </div>
  );
};

export default ProductsHeader;