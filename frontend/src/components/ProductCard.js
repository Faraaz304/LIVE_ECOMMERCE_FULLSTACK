"use client";
import Image from "next/image";
import Link from "next/link"; // 1. Import the Link component

export default function ProductCard({ product }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={
            product.imageUrl?.startsWith("http")
              ? product.imageUrl
              : `http://localhost:8082${product.imageUrl}`
          }
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-2">
          {product.description || "No description available"}
        </p>

        <p className="text-[var(--primary)] font-bold text-lg mb-2">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span
            className={`px-2 py-1 rounded-full ${
              product.live
                ? "bg-green-500/20 text-green-600"
                : "bg-red-500/20 text-red-600"
            }`}
          >
            {product.live ? "Live" : "Offline"}
          </span>

          <span
            className={`px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "bg-red-500/20 text-red-600"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
        </div>

        {/* 2. Wrap the button with a Link */}
        <div className="mt-4 flex justify-end">
          <Link href={`/product/${product.id}`} passHref>
            <button className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-all">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}



// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { Edit, Copy, Trash2 } from "lucide-react"; // Import necessary icons

// export default function ProductCard({ product }) {
//   // Determine if stock is low for styling purposes
//   const isLowStock = product.stock > 0 && product.stock <= 10;
//   const isOutOfStock = product.stock === 0;

//   return (
//     <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
//       {/* Image Section */}
//       <div className="relative bg-gray-100 dark:bg-gray-800">
//         <div className="relative w-full h-52">
//           <Image
//             src={
//               product.imageUrl?.startsWith("http")
//                 ? product.imageUrl
//                 : `http://localhost:8082${product.imageUrl}`
//             }
//             alt={product.name}
//             fill
//             className="object-cover"
//             unoptimized
//           />
//         </div>

//         {/* Checkbox Overlay */}
//         <div className="absolute top-3 left-3">
//           <input
//             type="checkbox"
//             className="h-5 w-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
//           />
//         </div>

//         {/* Status Badge Overlay */}
//         <div className="absolute top-3 right-3">
//           <span
//             className={`px-3 py-1 text-xs font-semibold rounded-full ${
//               product.live
//                 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                 : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
//             }`}
//           >
//             {product.live ? "Active" : "Inactive"}
//           </span>
//         </div>
//       </div>

//       {/* Info Section */}
//       <div className="p-4 space-y-3">
//         <h3 className="font-semibold text-md text-[var(--foreground)] truncate" title={product.name}>
//           {product.name}
//         </h3>

//         <p className="text-2xl font-bold text-[var(--primary)]">
//           ₹{product.price.toLocaleString("en-IN")}
//         </p>

//         {/* Meta Badges (using category as an example) */}
//         <div className="flex flex-wrap gap-2">
//           <span className="text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">
//             {product.category}
//           </span>
//           {/* You can add more meta badges here if your data supports it */}
//         </div>
        
//         {/* Stock and SKU */}
//         <div className="flex justify-between items-center text-sm text-[var(--muted-foreground)] pt-1">
//           <span>
//             Stock:{" "}
//             <span className={`font-bold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
//               {product.stock}
//             </span>
//           </span>
//           <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//             ID: {product.id}
//           </span>
//         </div>
//       </div>

//       {/* Actions Section */}
//       <div className="px-4 pb-4 pt-2">
//         <div className="flex items-center gap-2">
//           <Link href={`/product/update/${product.id}`} className="flex-1">
//             <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors">
//               <Edit size={16} />
//               Edit
//             </button>
//           </Link>
//           <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
//             <Copy size={16} />
//           </button>
//           {/* Note: Delete functionality is on the detail page, this is for UI */}
//           <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }