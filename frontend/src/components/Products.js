"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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

  if (!products.length) {
    return <div className="p-6 text-[var(--foreground)]">No products available.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--primary)]">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
