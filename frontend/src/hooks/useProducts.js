import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:8082/api/products";

const formatProductData = (product) => {
  if (!product) return null;

  return {
    id: product.id.toString(),
    userid: product.userid, 
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

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []); 

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

  const createProduct = useCallback(async (productData, imageFile) => {
    setIsLoading(true);
    setError(null);
    try {
      const storedUserId = localStorage.getItem('userid');
      if (!storedUserId) throw new Error("User ID not found. Please log in.");

      const finalProductData = {
        ...productData,
        userid: Number(storedUserId) 
      };

      const formData = new FormData();
      formData.append("product", JSON.stringify(finalProductData));
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
   * FIX: Now automatically injects userid so the relationship isn't broken/orphaned.
   */
  const updateProduct = useCallback(async (id, productData, imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get User ID from Local Storage
      const storedUserId = localStorage.getItem('userid');
      
      if (!storedUserId) {
        throw new Error("User ID missing. Cannot verify ownership for update.");
      }

      // 2. Merge userid into the update payload
      const finalProductData = { 
        ...productData, 
        userid: Number(storedUserId) 
      };
      
      const formData = new FormData();
      formData.append("product", JSON.stringify(finalProductData));
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

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