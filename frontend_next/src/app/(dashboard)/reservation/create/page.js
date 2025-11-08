// app/(dashboard)/reservation/create/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarPlus, Phone, User, Package, Users, Info, Bell, Check } from 'lucide-react';

// NO METADATA EXPORT IN THIS FILE, as requested.

const CreateReservationPage = () => {
  const router = useRouter();

  // --- ORIGINAL STATE FOR API PAYLOAD (PRESERVED) ---
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [people, setPeople] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // --- ORIGINAL SUBMISSION STATE (PRESERVED) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // --- Helper for formatting dates/times for UI display ---
  const getDisplayDate = (datetimeLocalString) => {
    if (!datetimeLocalString) return '-';
    try {
        return new Date(datetimeLocalString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return datetimeLocalString.split('T')[0];
    }
  };

  const getDisplayTime = (datetimeLocalString) => {
    if (!datetimeLocalString) return '-';
    try {
        return new Date(datetimeLocalString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
        return datetimeLocalString.split('T')[1];
    }
  };

  // --- ORIGINAL handleSubmit function (PRESERVED) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation matching the original logic
    if (!customerName || !customerPhone || !productName || !startTime || !endTime) {
      setSubmitError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    // FIX: Append seconds to the date-time string as per previous debug
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    const newReservationData = {
      customerName,
      customerPhone,
      productName,
      people: parseInt(people, 10),
      status: 'Pending',
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
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      setSubmitSuccess(true);
      alert('Reservation created successfully!');
      router.push('/reservation');

    } catch (err) {
      console.error('Error creating reservation:', err);
      setSubmitError(err.message || 'Failed to create reservation. Please check the console and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex-1 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#111827]">Create Manual Reservation</h1>
        <p className="text-base text-[#4b5563]">Create a reservation for walk-in customers or phone inquiries. All fields marked with * are required.</p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg mb-8 flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderLeft: '4px solid #667eea' }}
      >
        <Info className="text-[#667eea] w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-[#374151] text-sm">
          <strong>Note:</strong> Manual reservations are automatically confirmed. Customer will receive SMS/WhatsApp confirmation if you enable it below.
        </div>
      </motion.div>

      {/* Form starts here */}
      <form onSubmit={handleSubmit}>
        {/* Customer Details Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-8 mb-6"
        >
          <div className="pb-4 border-b-2 border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-[#111827] flex items-center gap-3">
              <User className="w-6 h-6 text-gray-700" />
              Customer Details
            </h2>
            <p className="text-sm text-[#6b7280]">Enter customer information for the reservation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                Full Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <span className="text-xs text-[#6b7280]">First and last name</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                Phone Number <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
                <input
                  type="tel"
                  className="w-full py-3 pl-10 pr-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <span className="text-xs text-[#6b7280]">10-digit mobile number</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                Product Name <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
                <input
                  type="text"
                  className="w-full py-3 pl-10 pr-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <span className="text-xs text-[#6b7280]">Product customer is interested in</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                Number of People
              </label>
              <input
                type="number"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10"
                required
                disabled={isSubmitting}
              />
              <span className="text-xs text-[#6b7280]">How many people will visit</span>
            </div>
          </div>
        </motion.div>

        {/* Reservation Details Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-8 mb-6"
        >
          <div className="pb-4 border-b-2 border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-[#111827] flex items-center gap-3">
              <CalendarPlus className="w-6 h-6 text-gray-700" />
              Reservation Details
            </h2>
            <p className="text-sm text-[#6b7280]">Select start and end date/time for the visit</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                Start Date & Time <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="datetime-local"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <span className="text-xs text-[#6b7280]">Choose start date and time</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                End Date & Time <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="datetime-local"
                className="py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <span className="text-xs text-[#6b7280]">Choose end date and time</span>
            </div>
          </div>
        </motion.div>

        {/* Summary Box */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl p-6 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}
        >
          <div className="text-lg font-bold text-[#111827] mb-4">📋 Reservation Summary</div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">Customer Name</span>
              <span className="text-sm font-semibold text-[#111827]">{customerName || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">Phone Number</span>
              <span className="text-sm font-semibold text-[#111827]">{customerPhone || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">Product</span>
              <span className="text-sm font-semibold text-[#111827]">{productName || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">Number of People</span>
              <span className="text-sm font-semibold text-[#111827]">{people}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">Start Date & Time</span>
              <span className="text-sm font-semibold text-[#111827]">{startTime ? `${getDisplayDate(startTime)} at ${getDisplayTime(startTime)}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-[#4b5563]">End Date & Time</span>
              <span className="text-sm font-semibold text-[#111827]">{endTime ? `${getDisplayDate(endTime)} at ${getDisplayTime(endTime)}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#4b5563]">Status</span>
              <span className="text-sm font-semibold text-[#10b981]">Auto-Confirmed ✓</span>
            </div>
          </div>
        </motion.div>

        {/* Display submission error */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mt-4 text-center"
          >
            {submitError}
          </motion.div>
        )}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mt-4 text-center"
          >
            ✅ Reservation created successfully! Redirecting...
          </motion.div>
        )}

        {/* Fixed Actions */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e7eb] p-6 -mx-8">
          <div className="flex justify-end gap-3 flex-col sm:flex-row">
            <button
              type="button"
              className="py-3 px-6 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-50 flex items-center justify-center"
              onClick={() => router.push('/reservation')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-px flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              disabled={isSubmitting}
            >
              <Check className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Reservation'}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReservationPage;