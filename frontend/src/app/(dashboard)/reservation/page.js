"use client";
import React, { useEffect, useState } from "react";
import ReservationList from "../../../components/ReservationList";
import ReservationForm from "../../../components/ReservationForm";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8088/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new reservation form submission
  const handleNewReservation = async (formData) => {
    try {
      const res = await fetch("http://localhost:8088/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.influencerName,
          productName: formData.product,
          people: 1, // default for now
          status: "Pending",
          startTime: formData.date,
          endTime: formData.date,
          customerPhone: "+0000000000", // can add field later
        }),
      });

      if (res.ok) {
        await fetchReservations();
        setShowForm(false);
      } else {
        console.error("Failed to create reservation:", res.status);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Close" : "Book New"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ReservationForm onSubmit={handleNewReservation} />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading reservations...</p>
      ) : (
        <ReservationList reservations={reservations} />
      )}
    </div>
  );
}
