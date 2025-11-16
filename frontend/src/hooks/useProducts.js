import { useState, useCallback } from 'react';

const BASE_URL = 'http://localhost:8082/api/products';

/**
 * Formats a raw product object from the API into a standardized format for the frontend.
 * @param {object} product - The raw product object from the backend.
 * @returns {object|null} The formatted product object or null if input is null/undefined.
 */
const formatProductData = (product) => {
  if (!product) return null;
  return {
    id: product.id.toString(), // Ensure ID is string for consistency
    name: product.name,
    description: product.description,
    price: new Intl.NumberFormat('en-IN').format(product.price), // Formatted price for display
    rawPrice: product.price, // Keep raw price for editing/updates
    stock: product.stock,
    category: product.category,
    status: product.live ? 'active' : 'inactive', // Derived status
    live: product.live, // Original live status
    sku: product.sku || null, // Assuming SKU might be added later or derived
    imageUrl: product.imageUrl ? `http://localhost:8082${product.imageUrl}` : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

/**
 * A custom React hook for managing product-related API calls and state.
 * Provides functions for fetching, creating, updating, and deleting products.
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null); // For single product fetches
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches all products from the API.
   * @returns {Array} An array of formatted product objects.
   */
  const getAllProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedProducts = data.map(formatProductData);
      setProducts(formattedProducts);
      return formattedProducts;
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetches a single product by its ID.
   * @param {string|number} id - The ID of the product to fetch.
   * @returns {object|null} The formatted product object or null if not found/error.
   */
  const getProductById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedProduct = formatProductData(data);
      setProduct(formattedProduct);
      return formattedProduct;
    } catch (err) {
      console.error(`Failed to fetch product with ID ${id}:`, err);
      setError('Failed to load product. Please try again later.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Creates a new product.
   * @param {object} productData - An object containing product details (name, description, price, etc.).
   * @param {File} [imageFile] - The optional image file to upload.
   * @returns {object} An object indicating success and the new product, or error.
   */
  const createProduct = useCallback(async (productData, imageFile) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify(productData));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed for FormData, browser sets it automatically
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const newProduct = await response.json();
      // Optionally update the local list of products or re-fetch
      // setProducts(prev => [...prev, formatProductData(newProduct)]);
      return { success: true, product: formatProductData(newProduct) };
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(`Failed to create product: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Updates an existing product.
   * @param {string|number} id - The ID of the product to update.
   * @param {object} productData - An object containing updated product details.
   * @param {File} [imageFile] - The optional new image file to upload (if null, existing image is kept).
   * @returns {object} An object indicating success and the updated product, or error.
   */
  const updateProduct = useCallback(async (id, productData, imageFile) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify(productData));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      // If imageFile is not provided, the backend should ideally keep the existing image.
      // No need to explicitly send `null` for the image if the intention is to retain it.

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const updatedProduct = await response.json();
      // Optionally update the local list of products or re-fetch
      // setProducts(prev => prev.map(p => (p.id === id.toString() ? formatProductData(updatedProduct) : p)));
      return { success: true, product: formatProductData(updatedProduct) };
    } catch (err) {
      console.error(`Failed to update product with ID ${id}:`, err);
      setError(`Failed to update product: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a product by its ID.
   * @param {string|number} id - The ID of the product to delete.
   * @returns {object} An object indicating success or error.
   */
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // If successful, remove the product from the local state
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id.toString()));
      return { success: true };
    } catch (err) {
      console.error(`Failed to delete product with ID ${id}:`, err);
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
    // You might also want to expose setProducts/setProduct if you need direct manipulation
    // setProducts,
    // setProduct,
  };
};

export default useProducts;