'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// NO METADATA EXPORT IN THIS FILE, as requested.

const dummyCategories = [
  {
    id: 'cat1',
    icon: '💎',
    name: 'Necklace Sets',
    description: 'Traditional and modern necklace designs',
    productCount: 24,
    createdAt: 'Jan 10, 2025',
    parent: null,
  },
  {
    id: 'cat2',
    icon: '💍',
    name: 'Rings',
    description: 'Wedding, engagement, and casual rings',
    productCount: 18,
    createdAt: 'Jan 12, 2025',
    parent: null,
  },
  {
    id: 'cat3',
    icon: '👂',
    name: 'Earrings',
    description: 'Jhumkas, studs, and chandeliers',
    productCount: 32,
    createdAt: 'Jan 15, 2025',
    parent: null,
  },
  {
    id: 'cat4',
    icon: '👑',
    name: 'Bridal Collections',
    description: 'Complete bridal jewelry sets',
    productCount: 15,
    createdAt: 'Jan 18, 2025',
    parent: null,
  },
  {
    id: 'cat5',
    icon: '📿',
    name: 'Bracelets',
    description: 'Gold and diamond bracelets',
    productCount: 12,
    createdAt: 'Jan 20, 2025',
    parent: null,
  },
  {
    id: 'cat6',
    icon: '⚪',
    name: 'Bangles',
    description: 'Traditional and contemporary bangles',
    productCount: 28,
    createdAt: 'Jan 22, 2025',
    parent: null,
  },
  {
    id: 'cat7',
    icon: '🔗',
    name: 'Chains',
    description: 'Gold chains for daily wear',
    productCount: 9,
    createdAt: 'Jan 25, 2025',
    parent: null,
  },
];

const availableIcons = ['💎', '💍', '👂', '👑', '📿', '⚪', '🔗', '✨', '💖', '⭐', '🌸', '🌼'];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(dummyCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingCategory, setEditingCategory] = useState(null); // Stores category object if editing

  // Form states for modal
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💎');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showAddModal = () => {
    setModalMode('add');
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setParentCategory('');
    setSelectedIcon('💎');
    setIsModalOpen(true);
  };

  const showEditModal = (category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setParentCategory(category.parent || '');
    setSelectedIcon(category.icon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newCategory = {
        id: `cat${categories.length + 1}`, // Simple ID generation
        icon: selectedIcon,
        name: categoryName,
        description: categoryDescription,
        productCount: 0,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        parent: parentCategory || null,
      };
      setCategories((prev) => [...prev, newCategory]);
      console.log('Added category:', newCategory);
    } else if (modalMode === 'edit' && editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                icon: selectedIcon,
                name: categoryName,
                description: categoryDescription,
                parent: parentCategory || null,
              }
            : cat
        )
      );
      console.log('Edited category:', { ...editingCategory, name: categoryName, description: categoryDescription, icon: selectedIcon, parent: parentCategory });
    }
    closeModal();
  };

  const confirmDelete = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      console.log('Deleted category:', categoryId);
    }
  };

  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Product Categories</h1>
          <p className="text-base text-[#6b7280] mt-1">Organize your jewelry products into categories</p>
        </div>
        <button
          className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          onClick={showAddModal}
        >
          ➕ Add Category
        </button>
      </div>

      {/* Info Box */}
      <div
        className="rounded-lg p-4 mb-6"
        style={{ background: 'rgba(102, 126, 234, 0.05)', borderLeft: '4px solid #667eea' }}
      >
        <p className="text-sm text-[#6b7280] leading-relaxed">
          💡 <strong>Tip:</strong> Well-organized categories make it easier for customers to find products and help
          improve your product visibility in streams.
        </p>
      </div>

      {/* Categories Container */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 border-b border-[#e5e7eb]">
          <div className="relative max-w-lg">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea]"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center p-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-[#374151] mb-2">No Categories Found</h3>
            <p className="text-base text-[#6b7280] mb-6">
              Try adjusting your search or add a new category.
            </p>
            <button
              className="py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 mx-auto"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              onClick={showAddModal}
            >
              ➕ Add New Category
            </button>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
                <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Category Name</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Products</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Created Date</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-[#374151]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-b-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        {category.icon}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#374151] mb-0.5">{category.name}</div>
                        <div className="text-sm text-[#6b7280]">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-base font-semibold text-[#374151]">{category.productCount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6b7280]">{category.createdAt}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        className="py-1.5 px-3 border-2 border-[#e5e7eb] bg-white rounded-md text-sm cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea]"
                        onClick={() => showEditModal(category)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="py-1.5 px-3 border-2 border-[#e5e7eb] bg-white rounded-md text-sm cursor-pointer transition-all hover:border-[#fecaca] hover:text-[#ef4444]"
                        onClick={() => confirmDelete(category.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#111827]">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl text-[#6b7280] transition-all hover:bg-gray-200"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Category Name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="e.g., Necklace Sets"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                <div className="text-xs text-[#6b7280] mt-1">
                  Enter a clear, descriptive name for your category
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">Description</label>
                <textarea
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm min-h-[100px] resize-y transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="Brief description of this category..."
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                ></textarea>
                <div className="text-xs text-[#6b7280] mt-1">
                  Optional description to help identify this category
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Parent Category <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                </label>
                <select
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">None - Main Category</option>
                  {categories
                    .filter(cat => cat.id !== (editingCategory ? editingCategory.id : null)) // Cannot be its own parent
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <div className="text-xs text-[#6b7280] mt-1">
                  Select a parent category to create a subcategory
                </div>
              </div>

              <div className="mb-0">
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Icon <span className="text-[#9ca3af] font-normal text-xs">(Optional)</span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mt-2">
                  {availableIcons.map((icon, index) => (
                    <div
                      key={index}
                      className={`aspect-square border-2 border-[#e5e7eb] rounded-lg bg-gray-50 flex items-center justify-center text-xl cursor-pointer transition-all hover:border-[#667eea] hover:bg-[#667eea]/[0.05]
                        ${selectedIcon === icon ? 'border-[#667eea] bg-[#667eea]/[0.1]' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-[#6b7280] mt-1">
                  Choose an icon to visually represent this category
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;