// import Products from "../../../components/Products";

// export default function ProductPage() {
//   return (
//     <Products />
//   );
// }


"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import Link from "next/link"; // 1. Import Link
import { Plus } from "lucide-react"; // Optional: for an icon

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8082/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-[var(--foreground)]">Loading products...</div>;
  }

  return (
    <div className="p-6">
      {/* 2. Add the header with the new button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[var(--primary)]">Products</h2>
        <Link href="/product/add">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-all">
            <Plus size={18} />
            Add Product
          </button>
        </Link>
      </div>

      {!products.length ? (
        <div className="p-6 text-center text-[var(--foreground)]">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}