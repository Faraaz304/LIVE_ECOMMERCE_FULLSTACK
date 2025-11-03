"use client";
import { useEffect, useState } from "react";
// 1. Import the useParams hook from next/navigation
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Edit, Trash2, Share2 } from "lucide-react";

// 2. Remove `params` from the component's props
export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Get the params object using the hook
  const params = useParams();
  const id = params.id; // Get the id from the hook's return value

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8082/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center text-sm text-[var(--muted-foreground)] mb-1">
            <Link href="/product" className="hover:underline">Products</Link>
            <ChevronRight size={16} className="mx-1" />
            <span>{product.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            {product.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--secondary)] hover:opacity-90 transition-all">
            <Edit size={16} /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--secondary)] hover:opacity-90 transition-all">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-600 hover:opacity-90 transition-all">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            <Image
              src={`http://localhost:8082${product.imageUrl}`}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4 border-b border-[var(--border)] pb-3">
              Pricing & Details
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Price</span>
                <span className="font-bold text-lg text-[var(--primary)]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Stock</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Category</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Status</span>
                 <span className={`px-2 py-1 text-xs rounded-full ${
                    product.live ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                  }`}>
                    {product.live ? "Live" : "Offline"}
                  </span>
              </div>
               <div className="pt-2">
                <span className="text-[var(--muted-foreground)]">Description</span>
                <p className="font-semibold mt-1">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}