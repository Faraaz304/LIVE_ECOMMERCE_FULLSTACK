// app/(dashboard)/reservation/details/[reservationId]/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// NO METADATA EXPORT IN THIS FILE, as requested.

const ReservationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { reservationId: routeReservationId } = params; // Get ID from URL

  // Hardcoded dummy data directly within the component, matching the HTML
  const dummyData = {
    bookingId: routeReservationId || '#RES001', // Use actual ID from URL if available, else default
    status: 'confirmed', // 'confirmed', 'pending', 'completed', 'cancelled', 'no-show'
    createdAt: 'Jan 24, 2025 at 3:45 PM',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@email.com',
    date: 'January 25, 2025',
    timeSlot: '10:00 AM - 10:30 AM',
    duration: '30 minutes',
    people: 2,
    bookingSource: 'Live Stream',
    specialRequests: 'Please keep the iPhone 14 Pro Max in Space Black ready for viewing. Interested in trade-in options.',
    product1: {
      name: 'iPhone 14 128GB',
      meta: 'Space Black • 128GB Storage',
      price: '79,999',
      image: 'https://via.placeholder.com/80/667eea/ffffff?text=P14',
    },
    product2: {
      name: 'AirPods Pro (2nd Gen)',
      meta: 'White • Active Noise Cancellation',
      price: '24,900',
      image: 'https://via.placeholder.com/80/764ba2/ffffff?text=AP2',
    },
    estimatedTotal: '1,04,899',
    timeline: [
      { title: 'Reservation Created', time: 'Jan 24, 2025 at 3:45 PM', completed: true },
      { title: 'Confirmed by Customer', time: 'Jan 24, 2025 at 3:46 PM', completed: true },
      { title: 'Reminder Sent (24h)', time: 'Jan 24, 2025 at 10:00 AM', completed: true },
      { title: 'Customer Arrival', time: 'Pending (Tomorrow at 10:00 AM)', completed: false },
      { title: 'Visit Completed', time: 'Not yet completed', completed: false },
    ],
    notes: [
      { author: 'Kumar Electronics Team', time: '2 hours ago', content: 'Customer called to confirm the trade-in program details. Explained the process and documents needed.' },
      { author: 'System', time: '1 day ago', content: 'Automatic reminder sent via SMS and WhatsApp.' },
    ],
    customerHistory: {
        totalVisits: 3,
        totalPurchases: 2,
        lastVisit: 'Dec 15, 2024',
        customerSince: 'Oct 2024',
    }
  };

  const [reservationStatus, setReservationStatus] = useState(dummyData.status); // To show status in header

  // Helper for dynamic status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#d1fae5] text-[#065f46]';
      case 'pending': return 'bg-[#fef3c7] text-[#92400e]';
      case 'completed': return 'bg-[#dbeafe] text-[#1e40af]';
      case 'cancelled': return 'bg-[#fee2e2] text-[#991b1b]';
      case 'no-show': return 'bg-[#f3f4f6] text-[#4b5563]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCustomerAvatarInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Simplified handlers - these would be actual API calls/state updates in a real app
  const handleEdit = () => alert('Edit functionality not implemented for this view.');
  const handlePrint = () => alert('Print functionality not implemented.');
  const handleCallCustomer = () => alert(`Calling ${dummyData.customerPhone}`);
  const handleSendWhatsApp = () => alert(`Sending WhatsApp to ${dummyData.customerPhone}`);
  const handleSendReminder = () => alert(`Sending reminder for booking ${dummyData.bookingId}`);
  const handleReschedule = () => alert(`Reschedule booking ${dummyData.bookingId}`);
  const handleMarkArrived = () => alert(`Marking ${dummyData.bookingId} as Arrived`);
  const handleMarkCompleted = () => alert(`Marking ${dummyData.bookingId} as Completed`);
  const handleMarkNoShow = () => alert(`Marking ${dummyData.bookingId} as No-Show`);
  const handleCancelReservation = () => {
    if (confirm(`Are you sure you want to cancel reservation ${dummyData.bookingId}?`)) {
      alert(`Cancelling reservation ${dummyData.bookingId}`);
      // In a real app, API call here, then router.push('/reservation');
    }
  };
  const handleScanQRCode = () => alert('Scan QR Code functionality not implemented.');
  const handleAddNote = () => alert('Add Note functionality not implemented.');


  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Breadcrumb (handled by ClientLayout) */}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex-1">
          <span className={`py-2 px-4 rounded-full text-sm font-semibold mb-4 inline-flex items-center gap-2 ${getStatusBadgeClass(reservationStatus)}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'currentColor' }}></span>
            {reservationStatus.charAt(0).toUpperCase() + reservationStatus.slice(1)}
          </span>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Reservation {dummyData.bookingId}</h1>
          <p className="text-base text-[#6b7280]">Created on {dummyData.createdAt}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEdit}
            className="py-3 px-5 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handlePrint}
            className="py-3 px-5 bg-white text-[#374151] border-2 border-[#e5e7eb] rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Alert for Upcoming Reservation (simplified check for demo) */}
      {dummyData.status === 'confirmed' && ( // Assuming confirmed upcoming for alert
        <div className="p-4 rounded-lg mb-6 flex items-start gap-3" style={{ background: '#dbeafe', color: '#1e40af' }}>
          <span className="text-xl">ℹ️</span>
          <div className="flex-1">
            <div className="font-semibold mb-1">Upcoming Reservation</div>
            <div className="text-sm">This reservation is scheduled for {dummyData.date} at {dummyData.timeSlot.split(' - ')[0]}. Make sure the customer receives a reminder.</div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div>
          {/* Booking Information Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Booking Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Booking ID</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.bookingId}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Booking Source</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.bookingSource}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Date</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.date}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Time Slot</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.timeSlot}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Duration</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.duration}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Number of People</span>
                  <span className="text-xl text-[#111827] font-semibold">{dummyData.people}</span>
              </div>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Customer Information
              </h2>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                {getCustomerAvatarInitials(dummyData.customerName)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#111827] mb-1">{dummyData.customerName}</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                    <span className="text-[#667eea]">📞</span>
                    <span>{dummyData.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                    <span className="text-[#667eea]">✉️</span>
                    <span>{dummyData.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {dummyData.specialRequests && (
                <div className="p-4 rounded-lg mt-4" style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                    <div className="font-semibold text-sm text-[#92400e] mb-2 flex items-center gap-2">
                        <span>⚠️</span>
                        Special Requests
                    </div>
                    <div className="text-sm text-[#92400e]">{dummyData.specialRequests}</div>
                </div>
            )}
          </div>

          {/* Reservation Details Card (Products of Interest) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                Products of Interest
              </h2>
            </div>
            
            {/* Product 1 */}
            <div className="flex gap-4 p-4 border-2 border-gray-200 rounded-lg mb-3 hover:border-[#667eea] hover:shadow-sm">
                {dummyData.product1.image && (
                    <img src={dummyData.product1.image} alt={dummyData.product1.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                    <div className="text-base font-semibold text-[#111827] mb-1">{dummyData.product1.name}</div>
                    <div className="text-sm text-[#6b7280]">{dummyData.product1.meta}</div>
                    <div className="text-xl font-bold text-[#667eea] mt-2">₹{dummyData.product1.price}</div>
                </div>
            </div>

            {/* Product 2 */}
            <div className="flex gap-4 p-4 border-2 border-gray-200 rounded-lg mb-3 hover:border-[#667eea] hover:shadow-sm">
                {dummyData.product2.image && (
                    <img src={dummyData.product2.image} alt={dummyData.product2.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                    <div className="text-base font-semibold text-[#111827] mb-1">{dummyData.product2.name}</div>
                    <div className="text-sm text-[#6b7280]">{dummyData.product2.meta}</div>
                    <div className="text-xl font-bold text-[#667eea] mt-2">₹{dummyData.product2.price}</div>
                </div>
            </div>

            <div className="h-px bg-gray-200 my-6"></div> {/* Divider */}

            <div className="flex justify-between items-center">
                <span className="text-sm text-[#6b7280] font-medium">Estimated Total Value</span>
                <span className="text-xl font-bold text-[#667eea]">₹{dummyData.estimatedTotal}</span>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                Timeline
              </h2>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div> {/* Vertical line */}

              {dummyData.timeline.map((item, index) => (
                  <div key={index} className="relative pb-6">
                      <div className={`absolute left-[-16px] top-0 w-4 h-4 rounded-full bg-white border-2 ${item.completed ? 'border-[#10b981] bg-[#10b981]' : 'border-[#667eea]'}`}></div>
                      <div className="ml-4 flex flex-col gap-1">
                          <div className="text-base font-semibold text-[#111827]">{item.title}</div>
                          <div className="text-sm text-[#6b7280]">{item.time}</div>
                      </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Internal Notes
              </h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {dummyData.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-gray-50 border-l-4 border-[#667eea] rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-[#374151]">{note.author}</span>
                          <span className="text-xs text-[#6b7280]">{note.time}</span>
                      </div>
                      <div className="text-sm text-[#374151] leading-relaxed">{note.content}</div>
                  </div>
              ))}
            </div>

            <div className="mt-6">
              <textarea className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm resize-y min-h-[100px] focus:outline-none focus:border-[#667eea]" placeholder="Add a note about this customer or reservation..."></textarea>
              <button
                className="mt-3 py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 0px 0px rgba(0,0,0,0)',
                  '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                onClick={handleAddNote}
              >
                ➕ Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div>
          {/* QR Code Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Customer Check-in
              </h2>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-48 h-48 mx-auto mb-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-44 h-44" style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="200" fill="%23FFFFFF"/><rect x="20" y="20" width="40" height="40" fill="%234A4A4A"/><rect x="140" y="20" width="40" height="40" fill="%234A4A4A"/><rect x="20" y="140" width="40" height="40" fill="%234A4A4A"/><rect x="80" y="80" width="40" height="40" fill="%234A4A4A"/><rect x="120" y="100" width="20" height="20" fill="%234A4A4A"/><rect x="140" y="120" width="20" height="20" fill="%234A4A4A"/><rect x="100" y="140" width="20" height="20" fill="%234A4A4A"/></svg>')`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                  }}></div>
              </div>
              <p className="text-sm text-[#4b5563] mb-4">
                <strong>Customer will show this QR code when they arrive</strong><br />
                Scan using your mobile app or click button below
              </p>
              <button
                className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-px"
                style={{
                  background: '#10b981',
                  boxShadow: '0 0px 0px rgba(0,0,0,0)',
                  '--tw-shadow': '0 10px 30px rgba(16, 185, 129, 0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                onClick={handleScanQRCode}
              >
                <span className="text-xl">📷</span>
                Scan QR Code
              </button>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </h2>
            </div>
            
            <div className="flex flex-col gap-3">
                <button
                    className="py-3 px-5 text-white rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    onClick={handleCallCustomer}
                >
                    <span className="text-xl">📞</span>
                    Call Customer
                </button>
                
                <button
                    className="py-3 px-5 text-white rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    onClick={handleSendWhatsApp}
                >
                    <span className="text-xl">💬</span>
                    Send WhatsApp Message
                </button>
                
                <button
                    className="py-3 px-5 bg-white text-[#667eea] border-2 border-[#667eea] rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-[#667eea]/[0.05]"
                    onClick={handleSendReminder}
                >
                    <span className="text-xl">🔔</span>
                    Send Reminder
                </button>
                
                <button
                    className="py-3 px-5 bg-white text-[#374151] border-2 border-[#d1d5db] rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                    onClick={handleReschedule}
                >
                    <span className="text-xl">📅</span>
                    Reschedule
                </button>
                
                <div className="h-px bg-gray-200 my-3"></div> {/* Divider */}
                
                <button
                    className="py-3 px-5 bg-[#10b981] text-white rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                    style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    onClick={handleMarkArrived}
                >
                    <span className="text-xl">✅</span>
                    Mark as Arrived
                </button>
                
                <button
                    className="py-3 px-5 bg-white text-[#374151] border-2 border-[#d1d5db] rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                    onClick={handleMarkCompleted}
                >
                    <span className="text-xl">✔️</span>
                    Mark as Completed
                </button>
                
                <div className="h-px bg-gray-200 my-3"></div> {/* Divider */}
                
                <button
                    className="py-3 px-5 bg-white text-[#374151] border-2 border-[#d1d5db] rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                    onClick={handleMarkNoShow}
                >
                    <span className="text-xl">🚫</span>
                    Mark as No-Show
                </button>
                
                <button
                    className="py-3 px-5 bg-[#ef4444] text-white rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                    style={{ boxShadow: '0 0px 0px rgba(0,0,0,0)', '--tw-shadow': '0 10px 30px rgba(239, 68, 68, 0.3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    onClick={handleCancelReservation}
                >
                    <span className="text-xl">✖️</span>
                    Cancel Reservation
                </button>
            </div>
          </div>

          {/* Visit Statistics Card (Static/Dummy for now) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 mb-6">
            <div className="pb-4 border-b-2 border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Customer History
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Total Visits</span>
                  <span className="text-xl text-[#111827] font-semibold">{dummyData.customerHistory.totalVisits}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Total Purchases</span>
                  <span className="text-xl text-[#111827] font-semibold">{dummyData.customerHistory.totalPurchases}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Last Visit</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.customerHistory.lastVisit}</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6b7280] font-medium">Customer Since</span>
                  <span className="text-base text-[#111827] font-semibold">{dummyData.customerHistory.customerSince}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;