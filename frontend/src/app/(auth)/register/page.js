"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Example call — replace with your real endpoint
    console.log("Registration data:", form);
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
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
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
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
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
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
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded text-white bg-[var(--color-primary)] hover:opacity-90 transition"
        >
          Sign Up
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