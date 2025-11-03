"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, UploadCloud } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();

  // State for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Product image is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();

    // The backend expects a 'product' field with stringified JSON
    const productDetails = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      live: isLive,
    };
    formData.append("product", JSON.stringify(productDetails));

    // And an 'image' field with the file
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:8082/api/products", {
        method: "POST",
        body: formData,
        // NOTE: Don't set Content-Type header manually,
        // the browser will do it correctly with the boundary for multipart/form-data
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create product.");
      }

      setSuccess(true);
      // Redirect back to the products list after a short delay
      setTimeout(() => {
        router.push("/product");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header and Breadcrumbs */}
      <div>
        <div className="flex items-center text-sm text-[var(--muted-foreground)] mb-1">
          <Link href="/product" className="hover:underline">Products</Link>
          <ChevronRight size={16} className="mx-1" />
          <span>Add Product</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          Create a New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Details */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price (₹)</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
          </div>
        </div>

        {/* Right Column: Image and Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">Product Image</h3>
            <label htmlFor="image-upload" className="cursor-pointer block w-full border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--primary)]">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-[var(--muted-foreground)]">
                  <UploadCloud size={32} />
                  <span>Click to upload or drag & drop</span>
                  <span className="text-xs">PNG, JPG, WEBP</span>
                </div>
              )}
            </label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">Status</h3>
            <div className="flex items-center justify-between">
              <span>Product Live</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isLive} onChange={() => setIsLive(!isLive)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
          </div>

          <div className="mt-4">
            {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-600 text-center">{error}</div>}
            {success && <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-600 text-center">Product created successfully!</div>}
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}