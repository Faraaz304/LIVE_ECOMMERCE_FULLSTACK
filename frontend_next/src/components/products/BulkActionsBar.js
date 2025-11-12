import React from 'react';

const BulkActionsBar = ({ selectedProductCount, onBulkAction, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`bg-[#667eea]/[0.1] border border-[#667eea]/[0.2] rounded-lg p-3 mb-5 flex justify-between items-center`}
    >
      <span className="text-[#667eea] font-medium text-sm">
        {selectedProductCount} products selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onBulkAction('Change Status')}
          className="py-2 px-4 bg-white border border-gray-300 rounded-lg cursor-pointer text-sm font-medium text-[#374151] transition-all hover:bg-gray-50"
        >
          Change Status
        </button>
        <button
          onClick={() => onBulkAction('Delete Selected')}
          className="py-2 px-4 bg-white border border-[#fecaca] rounded-lg cursor-pointer text-sm font-medium text-[#ef4444] transition-all hover:bg-gray-50"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;