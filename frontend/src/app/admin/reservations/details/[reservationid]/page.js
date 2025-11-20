'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // For adding notes
import { Textarea } from '@/components/ui/textarea'; // For adding notes

// Removed: useReservation import as we are using dummy data for now
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for conditional classnames

// Dummy Data for the main reservation object
const dummyReservation = {
  id: 1,
  bookingId: 'RES001',
  customerName: 'Priya Sharma',
  customerPhone: '+91 98765 43210',
  customerEmail: 'priya.sharma@email.com', // Added for display
  productName: 'iPhone 14 128GB, AirPods Pro (2nd Gen)', // From your mock
  people: 2,
  status: 'Confirmed', // Example status
  startTime: '2025-01-25T10:00:00',
  endTime: '2025-01-25T10:30:00',
  createdAt: '2025-01-24T15:45:00',
  updatedAt: '2025-01-24T15:46:00',
  specialRequests: 'Please keep the iPhone 14 Pro Max in Space Black ready for viewing. Interested in trade-in options.', // Added for display
  // Note: Your backend API doesn't currently support specialRequests and internalNotes directly on reservation.
  // This is for UI demonstration based on your HTML.
};

const ReservationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { reservationid } = params;

  // No longer using useReservation hook directly for data here
  // const { reservation, isLoading, error, getReservationById } = useReservation();

  // Always use dummy data now
  const reservation = dummyReservation;
  const isLoading = false; // Simulate not loading
  const error = null; // Simulate no error

  const [newNote, setNewNote] = useState('');

  // No API fetching needed now for the main reservation data
  // useEffect(() => {
  //   if (reservationid) {
  //     getReservationById(reservationid);
  //   }
  // }, [reservationid, getReservationById]);

  // Helper functions for formatting and display
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return { date: formattedDate, time: formattedTime, full: `${formattedDate} at ${formattedTime}` };
    } catch (e) {
      console.error("Error formatting date:", isoString, e);
      return { date: 'Invalid Date', time: 'N/A', full: 'Invalid Date' };
    }
  };

  const getCustomerInitials = (fullName) => {
    if (!fullName) return 'NA';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-[#d1fae5] text-[#065f46]'; // success
      case 'pending':
        return 'bg-[#fef3c7] text-[#92400e]'; // warning
      case 'completed':
        return 'bg-[#dbeafe] text-[#1e40af]'; // info
      case 'cancelled':
        return 'bg-[#fee2e2] text-[#991b1b]'; // error
      case 'no-show':
        return 'bg-[#f3f4f6] text-[#4b5563]'; // gray
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleQuickAction = (action) => {
    alert(`Action: "${action}" for Reservation ${reservationid || reservation.bookingId}`);
    // Implement API calls here, e.g., router.push('/api/reservations/confirm/...')
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Adding note: "${newNote}"`);
      // Implement API call to add note
      setNewNote('');
    }
  };

  // Dummy data for sections that aren't directly in your reservation API response
  const mockProductsOfInterest = [
    { id: 'p1', name: 'iPhone 14 128GB', meta: 'Space Black • 128GB Storage', price: 79999, imageUrl: 'https://via.placeholder.com/80' },
    { id: 'p4', name: 'AirPods Pro (2nd Gen)', meta: 'White • Active Noise Cancellation', price: 24900, imageUrl: 'https://via.placeholder.com/80' },
  ];

  const mockTimelineEvents = [
    { id: 1, title: 'Reservation Created', time: '2025-01-24T15:45:00', completed: true },
    { id: 2, title: 'Confirmed by Customer', time: '2025-01-24T15:46:00', completed: true },
    { id: 3, title: 'Reminder Sent (24h)', time: '2025-01-24T10:00:00', completed: true },
    { id: 4, title: 'Customer Arrival', time: 'Pending (Tomorrow at 10:00 AM)', completed: false },
    { id: 5, title: 'Visit Completed', time: 'Not yet completed', completed: false },
  ];

  const mockInternalNotes = [
    { id: 1, author: 'Kumar Electronics Team', time: '2 hours ago', content: 'Customer called to confirm the trade-in program details. Explained the process and documents needed.' },
    { id: 2, author: 'System', time: '1 day ago', content: 'Automatic reminder sent via SMS and WhatsApp.' },
  ];

  const mockCustomerHistory = {
    totalVisits: 3,
    totalPurchases: 2,
    lastVisit: 'Dec 15, 2024',
    customerSince: 'Oct 2024',
  };


  // Determine alert type based on reservation status/time
  const isUpcoming = reservation.startTime && new Date(reservation.startTime) > new Date();
  const isPending = reservation.status?.toLowerCase() === 'pending';

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/reservations" className="text-primary-500 hover:underline">
          Reservations
        </Link>
        <span>›</span>
        <span>Reservation Details</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex-1">
          <Badge
            className={cn(
              "status-badge large", // Base large badge classes
              getStatusBadgeClass(reservation.status), // Dynamic background/text color
              "mb-4" // Margin from title
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-2"></span> {/* Status indicator dot */}
            {reservation.status}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation #{reservation.bookingId}</h1>
          <p className="text-base text-gray-500">
            Created on {formatDateTime(reservation.createdAt).full}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => handleQuickAction('Edit')}>
            <span className="mr-2">✏️</span> Edit
          </Button>
          <Button variant="outline" onClick={() => handleQuickAction('Print')}>
            <span className="mr-2">🖨️</span> Print
          </Button>
        </div>
      </div>

      {/* Alert for Upcoming/Pending Reservation */}
      {isUpcoming && isPending && (
        <div className="
          p-4 rounded-md mb-6 flex items-start gap-3
          bg-info-500/10 text-info-500 border-l-4 border-info-500
        ">
          <span className="text-xl">ℹ️</span>
          <div className="flex-1">
            <div className="font-semibold mb-1">Upcoming Reservation</div>
            <div className="text-sm">
              This reservation is scheduled for {formatDateTime(reservation.startTime).date} at {formatDateTime(reservation.startTime).time}. Make sure the customer receives a reminder.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div>
          {/* Booking Information Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="text-2xl">📋</span> Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Booking ID</span>
                <span className="text-base text-gray-900 font-semibold">#{reservation.bookingId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Booking Source</span>
                <span className="text-base text-gray-900 font-semibold">Manual Booking</span> {/* Assuming manual creation */}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Date</span>
                <span className="text-base text-gray-900 font-semibold">{formatDateTime(reservation.startTime).date}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Time Slot</span>
                <span className="text-base text-gray-900 font-semibold">
                  {formatDateTime(reservation.startTime).time} - {formatDateTime(reservation.endTime).time}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Duration</span>
                <span className="text-base text-gray-900 font-semibold">
                  {/* Calculate duration, placeholder for now */}
                  30 minutes
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500 font-medium">Number of People</span>
                <span className="text-xl text-gray-900 font-bold">{reservation.people}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="text-2xl">👤</span> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {getCustomerInitials(reservation.customerName)}
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{reservation.customerName}</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-primary-500">📞</span>
                      <span>{reservation.customerPhone}</span>
                    </div>
                    {reservation.customerEmail && ( // Conditionally display email if available
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-primary-500">✉️</span>
                        <span>{reservation.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.specialRequests && (
                <div className="
                  p-4 bg-warning-500/10 border-l-4 border-warning-500 rounded-md
                ">
                  <div className="text-sm font-semibold text-warning-500 mb-2 flex items-center gap-2">
                    <span>⚠️</span> Special Requests
                  </div>
                  <p className="text-sm text-warning-500">
                    {reservation.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products of Interest Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="text-2xl">🛍️</span> Products of Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {mockProductsOfInterest.length > 0 ? (
                <>
                  {mockProductsOfInterest.map(product => (
                    <div key={product.id} className="flex gap-4 p-4 border-2 border-gray-200 rounded-md mb-3 hover:border-primary-500 hover:shadow-sm transition-all">
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md object-cover border border-gray-200" />
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 mb-1">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.meta}</div>
                        <div className="text-xl font-bold text-primary-500 mt-2">₹{product.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                  <div className="h-px bg-gray-200 my-6"></div> {/* Divider */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500 font-medium">Estimated Total Value</span>
                    <span className="text-xl text-primary-500 font-bold">
                      ₹{mockProductsOfInterest.reduce((sum, p) => sum + p.price, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">No specific products of interest noted.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;