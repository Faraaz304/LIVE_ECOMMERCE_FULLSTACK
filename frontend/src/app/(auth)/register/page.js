"use client";
import { useState } from "react";
import { auth } from "../../../lib/api"; // Import the auth object from your api.js

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", // This will map to 'username' in the API call
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
    setSuccess(false); // Clear success on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Prepare the payload to match your backend's expected format
      const payload = {
        username: form.name, // Map form 'name' to API 'username'
        email: form.email,
        password: form.password,
      };

      const data = await auth.register(payload); // Call the register function from lib/api.js
      console.log("Registration successful:", data);
      setSuccess(true);
      // Optionally redirect user or clear form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // Example: Redirect to login page after successful registration
      // window.location.href = "/login";
    } catch (err) {
      console.error("Registration failed:", err.message);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[var(--color-bg)] shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--color-primary)]">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">
            Registration successful! You can now{" "}
            <a href="/login" className="text-[var(--color-secondary)] underline">
              Login
            </a>.
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded text-white bg-[var(--color-primary)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[var(--color-secondary)] underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}