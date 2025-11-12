import React from 'react';

const ProductsFilterBar = ({
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onSortFilterChange,
  currentView,
  onSetView,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
          </span>
          <input
            type="text"
            id="searchInput"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
          id="statusFilter"
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Out of Stock</option>
        </select>

        <select
          className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
          id="categoryFilter"
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option>All Categories</option>
          <option value="Necklace Sets">Necklace Sets</option>
          <option value="Rings">Rings</option>
          <option value="Earrings">Earrings</option>
          <option value="Bridal Collections">Bridal Collections</option>
          <option value="Bracelets">Bracelets</option>
          <option value="Bangles">Bangles</option>
          <option value="study">Study</option>
        </select>

        <select
          className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
          id="sortFilter"
          onChange={(e) => onSortFilterChange(e.target.value)}
        >
          <option>Sort by: Newest</option>
          <option>Sort by: Oldest</option>
          <option>Sort by: Price Low-High</option>
          <option>Sort by: Price High-Low</option>
          <option>Sort by: Name A-Z</option>
        </select>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            className={`p-2 rounded-md cursor-pointer transition-all text-xl ${
              currentView === 'grid' ? 'bg-white shadow-sm' : ''
            }`}
            onClick={() => onSetView('grid')}
          >
            📱
          </button>
          <button
            className={`p-2 rounded-md cursor-pointer transition-all text-xl ${
              currentView === 'list' ? 'bg-white shadow-sm' : ''
            }`}
            onClick={() => onSetView('list')}
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterBar;