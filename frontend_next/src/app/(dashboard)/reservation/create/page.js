'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateReservationPage = () => {
  const router = useRouter();

  // State for form fields required by the API
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [people, setPeople] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation
    if (!customerName || !customerPhone || !productName || !startTime || !endTime) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // --- FIX: Append seconds to the date-time string ---
    // The input gives "YYYY-MM-DDTHH:MM", API needs "YYYY-MM-DDTHH:MM:SS"
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    const newReservationData = {
      customerName,
      customerPhone,
      productName,
      people: parseInt(people, 10),
      status: 'Pending', // Hardcoded as per your API structure
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    console.log('Submitting to API:', newReservationData);

    try {
      const response = await fetch('http://localhost:8088/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReservationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.message || 'Check API logs for details.'}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      setSubmitSuccess(true);
      alert('Reservation created successfully!');
      router.push('/reservation'); // Redirect to the reservation list page

    } catch (err) {
      console.error('Error creating reservation:', err);
      setSubmitError(err.message || 'Failed to create reservation. Please check the console and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex-1 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827]">Create Reservation</h1>
        <p className="text-base text-[#4b5563]">Enter the details below to create a new reservation.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151]">
                Customer Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Customer Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151]">
                Customer Phone <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="tel"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#374151]">
                Product Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                placeholder="e.g., Mobile Phone vivo"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Number of People */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151]">
                Number of People <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="number"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Start Time */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151]">
                Start Time <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="datetime-local"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151]">
                End Time <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="datetime-local"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submission Feedback */}
          {submitError && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 mt-6 text-center">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3 mt-6 text-center">
              Reservation created successfully! Redirecting...
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 bg-blue-600 text-white rounded-lg font-semibold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Reservation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReservationPage;