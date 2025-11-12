
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProductTableRow = ({ product, isSelected, onCheckboxChange }) => {
  const router = useRouter();

  return (
    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-sm cursor-pointer accent-[#667eea]"
          checked={isSelected}
          onChange={(e) => onCheckboxChange(product.id, e.target.checked)}
        />
      </td>
      <td className="py-4 px-4">
        <Link href={`/product/view/${product.id}`} className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
            ) : (
                product.icon // Assuming 'icon' might be a fallback if imageUrl is null
            )}
          </div>
          <span className="font-medium text-[#374151] text-sm">{product.name}</span>
        </Link>
      </td>
      <td className="py-4 px-4 text-sm text-[#6b7280]">{product.sku || 'N/A'}</td> {/* Added SKU fallback */}
      <td className="py-4 px-4 text-sm font-medium text-[#111827]">₹{product.price}</td>
      <td className="py-4 px-4 text-sm">
        <span
          className={`font-medium ${
            product.stock === 0 ? 'text-[#ef4444]' : 'text-[#374151]'
          }`}
        >
          {product.stock}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={`py-1 px-3 rounded-full text-xs font-semibold ${
            product.status === 'active'
              ? 'bg-[#d1fae5] text-[#065f46]'
              : 'bg-gray-100 text-[#4b5563]'
          }`}
        >
          {product.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/product/edit/${product.id}`)}
            className="p-1.5 rounded-md cursor-pointer text-[#6b7280] transition-all hover:bg-gray-100 hover:text-[#667eea]"
          >
            ✏️
          </button>
          <button
             onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              alert('Delete product (functionality not implemented)');
            }}
            className="p-1.5 rounded-md cursor-pointer text-[#6b7280] transition-all hover:bg-gray-100 hover:text-[#667eea]"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;