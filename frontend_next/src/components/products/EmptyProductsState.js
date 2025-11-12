import React from 'react';
import Link from 'next/link';

const EmptyProductsState = () => {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-2xl font-bold text-[#374151] mb-2">No Products Found</h3>
      <p className="text-base text-[#6b7280] mb-6">
        It looks like you haven't added any products yet.
      </p>
      <Link
        href="/product/add"
        className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        ➕ Add Your First Product
      </Link>
    </div>
  );
};

export default EmptyProductsState;