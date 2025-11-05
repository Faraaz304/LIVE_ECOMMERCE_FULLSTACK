import React from "react";

export default function ReservationCard({ reservation }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {reservation.influencerName || "Unnamed Influencer"}
        </h3>
        <span
          className={`text-sm px-2 py-1 rounded ${
            reservation.status === "CONFIRMED"
              ? "bg-green-100 text-green-700"
              : reservation.status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {reservation.status || "Pending"}
        </span>
      </div>

      <p className="text-gray-600 mt-1">
        Product:{" "}
        <span className="font-medium">
          {reservation.product || "No product linked"}
        </span>
      </p>

      <p className="text-gray-600 text-sm mt-1">
        {reservation.date
          ? new Date(reservation.date).toLocaleString()
          : "No date selected"}
      </p>
    </div>
  );
}
