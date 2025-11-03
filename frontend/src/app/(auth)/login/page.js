"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8084/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);

      // Save tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Redirect (change path as needed)
      window.location.href = "/product";
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded text-white bg-[var(--color-primary)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-[var(--color-secondary)] underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}