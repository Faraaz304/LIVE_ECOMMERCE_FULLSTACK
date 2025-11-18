import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:8082/api/products";

/**
 * Format a raw product from the API into frontend-friendly structure.
 */
const formatProductData = (product) => {
  if (!product) return null;

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    price: new Intl.NumberFormat("en-IN").format(product.price),
    rawPrice: product.price,
    stock: product.stock,
    category: product.category,
    status: product.live ? "active" : "inactive",
    live: product.live,
    sku: product.sku || null,
    imageUrl: product.imageUrl ? `http://localhost:8082${product.imageUrl}` : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

/**
 * A stable, fully optimized custom hook for product management.
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all products (stable, no infinite loops).
   */
  const getAllProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const formatted = data.map(formatProductData);

      setProducts(formatted);
      return formatted;
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []); // stable forever

  /**
   * Fetch single product by ID.
   */
  const getProductById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const formatted = formatProductData(data);

      setProduct(formatted);
      return formatted;
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError("Failed to load product. Please try again later.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new product.
   */
  const createProduct = useCallback(async (productData, imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("product", JSON.stringify(productData));
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(BASE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const newProduct = await response.json();
      return { success: true, product: formatProductData(newProduct) };
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(`Failed to create product: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update product.
   */
  const updateProduct = useCallback(async (id, productData, imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("product", JSON.stringify(productData));
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedProduct = await response.json();
      return { success: true, product: formatProductData(updatedProduct) };
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(`Failed to update product: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete product.
   */
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setProducts((prev) => prev.filter((p) => p.id !== id.toString()));
      return { success: true };
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(`Failed to delete product: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    product,
    isLoading,
    error,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
