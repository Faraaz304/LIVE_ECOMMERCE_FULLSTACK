import React from 'react';

const ProductsPagination = ({ totalProducts, currentPage = 1, itemsPerPage = 10, onPageChange }) => {
  // These are placeholders based on your original code's static pagination.
  // For actual pagination, you'd calculate totalPages and enable/disable buttons.
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex justify-between items-center">
      <div className="text-sm text-[#6b7280]">
        Showing <span className="font-semibold text-[#374151]">{startIndex}</span> to{' '}
        <span className="font-semibold text-[#374151]">{endIndex}</span> of{' '}
        <span className="font-semibold text-[#374151]">{totalProducts}</span> results
      </div>
      <div className="flex gap-2">
        <button className="py-2 px-4 border-2 border-[#e5e7eb] bg-white rounded-lg text-sm font-medium cursor-not-allowed text-[#374151] opacity-50">
          Previous
        </button>
        <button className="py-2 px-4 border-2 border-[#667eea] bg-[#667eea] text-white rounded-lg text-sm font-medium cursor-pointer">
          1
        </button>
        <button className="py-2 px-4 border-2 border-[#e5e7eb] bg-white rounded-lg text-sm font-medium cursor-pointer text-[#374151] hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPagination;