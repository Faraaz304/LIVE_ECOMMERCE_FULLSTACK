import { BASE_API_URL } from "./constants";

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong!");
  }
  return response.json();
};

export const auth = {
  /**
   * Registers a new user with the provided credentials.
   * @param {object} userData - The user registration data.
   * @param {string} userData.username - The user's chosen username.
   * @param {string} userData.email - The user's email address.
   * @param {string} userData.password - The user's password.
   * @returns {Promise<object>} The registration success data.
   */
  register: async ({ username, email, password }) => {
    const response = await fetch(`${BASE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return handleApiResponse(response);
  },

  // You can add more authentication related API calls here, e.g., login, forgot password
  // login: async ({ email, password }) => { ... }
};