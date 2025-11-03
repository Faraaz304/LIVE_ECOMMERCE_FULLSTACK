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