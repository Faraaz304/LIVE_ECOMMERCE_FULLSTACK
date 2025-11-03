// A central place for all your API calls related to products.

const API_BASE_URL = "http://localhost:8082/api/products";

// Helper function to handle API errors consistently
async function handleResponse(response) {
  if (!response.ok) {
    // Try to parse the error message from the backend, otherwise use a generic message
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  // For DELETE requests, there might be no content, so we handle that case
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return true; // Indicate success for non-JSON responses (like DELETE)
}


/**
 * Fetches all products.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const fetchProducts = async () => {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
};

/**
 * Fetches a single product by its ID.
 * @param {string} id - The ID of the product.
 * @returns {Promise<Object>} A promise that resolves to the product object.
 */
export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(response);
};

/**
 * Creates a new product.
 * @param {FormData} formData - The form data containing product details and the image.
 * @returns {Promise<Object>} A promise that resolves to the newly created product.
 */
export const createProduct = async (formData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

/**
 * Deletes a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<boolean>} A promise that resolves to true on success.
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};