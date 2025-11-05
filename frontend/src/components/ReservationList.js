import React from "react";
import ReservationCard from "./ReservationCard";

export default function ReservationList({ reservations }) {
  if (!reservations || reservations.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No reservations found. Try booking a new slot.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}
    