import React from 'react';

const ProductPreviewSidebar = ({
  formData,
  imagePreview,
  handleInputChange,
  isLoading,
}) => {
  const previewName = formData.name || 'Product Name';
  const previewPrice = formData.price ? `₹${parseFloat(formData.price).toLocaleString('en-IN')}` : '₹0';
  const previewStatus = formData.live ? 'Active' : 'Inactive';

  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <h2 className="text-base font-bold text-[#111827] mb-4">Product Preview</h2>
        <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-6xl mb-4">
          {imagePreview ? (
            <img src={imagePreview} alt="Product Preview" className="w-full h-full object-cover rounded-lg" />
          ) : (
            '💎'
          )}
        </div>
        <h3 className="text-base font-semibold text-[#374151] mb-2">{previewName}</h3>
        <div className="text-2xl font-bold text-[#667eea] mb-3">{previewPrice}</div>
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          {formData.category && <span className="bg-gray-100 py-1 px-2 rounded-md text-[#6b7280]">{formData.category}</span>}
        </div>
        <div
          className={`py-2 px-3 rounded-lg text-sm font-semibold text-center ${
            previewStatus === 'Active'
              ? 'bg-[#d1fae5] text-[#065f46]'
              : 'bg-gray-100 text-[#4b5563]'
          }`}
        >
          {previewStatus}
        </div>

        <div className="mt-5 pt-5 border-t border-[#e5e7eb]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#374151]">Product Visibility</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                name="live"
                checked={formData.live}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <div
                className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{
                  backgroundColor: formData.live ? '#667eea' : '#d1d5db',
                }}
              ></div>
            </label>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-lg" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
          <h5 className="text-xs font-semibold text-[#667eea] mb-2">💡 Tips for a great listing</h5>
          <ul className="list-disc list-inside text-xs text-[#6b7280] leading-relaxed">
            <li>Use clear, bright images.</li>
            <li>Write detailed, accurate descriptions.</li>
            <li>Set competitive pricing.</li>
            <li>Keep inventory updated.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewSidebar;