"use client";
import React, { useState } from "react";

export default function ReservationForm({ onSubmit }) {
  const [form, setForm] = useState({
    influencerName: "",
    product: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Book a Slot</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Influencer Name
        </label>
        <input
          type="text"
          name="influencerName"
          value={form.influencerName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product
        </label>
        <input
          type="text"
          name="product"
          value={form.product}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Create Reservation
      </button>
    </form>
  );
}
