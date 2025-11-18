'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useReservation } from '@/hooks/useReservation';
import useProducts from '@/hooks/useProducts';

// Import the new sub-components
import CustomerDetailsCard from '@/components/reservation/CustomerDetailsCard';
import ReservationDetailsCard from '@/components/reservation/ReservationDetailsCard';
import ProductSelectionCard from '@/components/reservation/ProductSelectionCard';

// Mock data for demonstration (only time slots remain, products will be from API)
const mockTimeSlots = [
  { id: '1', time: '10:00 AM', capacity: 2, isAvailable: true },
  { id: '2', time: '10:30 AM', capacity: 2, isAvailable: true },
  { id: '3', time: '11:00 AM', capacity: 2, isAvailable: true },
  { id: '4', time: '11:30 AM', capacity: 1, isAvailable: true },
  { id: '5', time: '12:00 PM', capacity: 0, isAvailable: false }, // Unavailable
  { id: '6', time: '12:30 PM', capacity: 2, isAvailable: true },
  { id: '7', time: '1:00 PM', capacity: 2, isAvailable: true },
  { id: '8', time: '1:30 PM', capacity: 2, isAvailable: true },
  { id: '9', time: '2:00 PM', capacity: 2, isAvailable: true },
  { id: '10', time: '2:30 PM', capacity: 2, isAvailable: true },
  { id: '11', time: '3:00 PM', capacity: 2, isAvailable: true },
  { id: '12', time: '3:30 PM', capacity: 2, isAvailable: true },
];

const CreateManualBookingPage = () => {
  const router = useRouter();

  // Hooks for API interactions
  const { products, isLoading: isLoadingProducts, getAllProducts, error: productsError } = useProducts();
  const { createReservation, isLoading: isSubmittingReservation, error: reservationError } = useReservation();

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    numberOfPeople: 1,
  });

  const [reservationDetails, setReservationDetails] = useState({
    selectedDate: '',
    selectedTimeSlotId: null,
  });

  const [productSelection, setProductSelection] = useState({
    searchTerm: '',
    selectedProductIds: new Set(),
  });

  // Removed additionalInfo and confirmationSettings states as per request

  const [filteredProducts, setFilteredProducts] = useState([]); // Will be populated by useProducts

  // Fetch all products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Update filtered products when products from API load or search term changes
  useEffect(() => {
    let currentProducts = products;
    if (productSelection.searchTerm) {
      const lowerCaseSearchSearchTerm = productSelection.searchTerm.toLowerCase(); // Corrected variable name
      currentProducts = currentProducts.filter(p =>
        p.name?.toLowerCase().includes(lowerCaseSearchSearchTerm) ||
        p.sku?.toLowerCase().includes(lowerCaseSearchSearchTerm)
      );
    }
    setFilteredProducts(currentProducts);
  }, [products, productSelection.searchTerm]);


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberOfPeopleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCustomerDetails(prev => ({ ...prev, numberOfPeople: isNaN(value) || value < 1 ? 1 : value }));
  };

  // Summary calculations
  const selectedTimeSlot = mockTimeSlots.find(slot => slot.id === reservationDetails.selectedTimeSlotId);
  const selectedProductsForSummary = products.filter(p => productSelection.selectedProductIds.has(p.id));
  const estimatedValue = selectedProductsForSummary.reduce((sum, p) => sum + p.rawPrice, 0); // Use rawPrice for calculation

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !reservationDetails.selectedDate || !reservationDetails.selectedTimeSlotId) {
      alert('Please fill in all required fields (Full Name, Phone Number, Date, Time Slot).');
      return;
    }

    // --- Date and Time Formatting for Backend API ---
    let startTime = null;
    let endTime = null;

    if (reservationDetails.selectedDate && selectedTimeSlot) {
      const [time, period] = selectedTimeSlot.time.split(' '); // e.g., "10:30", "AM"
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (period === 'AM' && hours === 12) { // Midnight (12 AM)
        hours = 0;
      }

      const selectedDateTime = new Date(`${reservationDetails.selectedDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
      startTime = selectedDateTime.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"

      // Assuming each slot is 30 minutes for endTime calculation
      selectedDateTime.setMinutes(selectedDateTime.getMinutes() + 30);
      endTime = selectedDateTime.toISOString().slice(0, 19);
    }
    // --- End Date and Time Formatting ---

    // Concatenate selected product names for the single productName field in the API
    const apiProductName = selectedProductsForSummary.map(p => p.name).join(', ');

    const reservationPayload = {
      customerName: customerDetails.fullName,
      customerPhone: customerDetails.phoneNumber,
      productName: apiProductName || null, // Can be null if no products selected
      people: customerDetails.numberOfPeople,
      status: 'Pending', // Hardcoded as per API example
      startTime: startTime,
      endTime: endTime,
    };

    try {
      const result = await createReservation(reservationPayload);
      if (result && result.success) {
        alert('Reservation created successfully!');
        router.push('/seller/reservations'); // Redirect to reservations list
      } else {
        alert(`Failed to create reservation: ${reservationError || 'An unknown error occurred'}`);
      }
    } catch (err) {
      console.error('Error creating reservation:', err);
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  if (isLoadingProducts) {
    return (
      <div className="bg-gray-50 p-8 max-w-screen-xl mx-auto flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-gray-50 p-8 max-w-screen-xl mx-auto flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-xl text-error-500">Error loading products: {productsError}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-8 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/seller/reservations" className="text-primary-500 hover:underline">
          Reservations
        </Link>
        <span>›</span>
        <span>Create Manual Reservation</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Manual Reservation</h1>
        <p className="text-base text-gray-600">Create a reservation for walk-in customers or phone inquiries. All fields marked with * are required.</p>
      </div>

      {/* Info Banner */}
      <div className="
        flex items-start gap-3 p-4 rounded-md mb-8
        bg-gradient-to-r from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)]
        border-l-4 border-primary-500
      ">
        <span className="text-xl text-primary-500">ℹ️</span>
        <div className="flex-1 text-gray-700 text-sm">
          <strong>Note:</strong> Manual reservations are automatically confirmed. Customer will receive SMS/WhatsApp confirmation if you enable it below.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Customer Details Card */}
            <CustomerDetailsCard
              customerDetails={customerDetails}
              handleCustomerChange={handleCustomerChange}
              handleNumberOfPeopleChange={handleNumberOfPeopleChange}
              isSubmittingReservation={isSubmittingReservation}
            />

            {/* Reservation Details Card */}
            <ReservationDetailsCard
              reservationDetails={reservationDetails}
              setReservationDetails={setReservationDetails}
              isSubmittingReservation={isSubmittingReservation}
            />

            {/* Product Selection Card */}
            <ProductSelectionCard
              productSelection={productSelection}
              setProductSelection={setProductSelection}
              products={products} // Pass all products
              filteredProducts={filteredProducts} // Pass filtered products
              isSubmittingReservation={isSubmittingReservation}
            />

            {/* Removed: Special Requests Card */}
            {/* Removed: Confirmation Settings Card */}

          </div>

          {/* Summary Box (Right Column) */}
          <div className="lg:col-span-1">
            <div className="
              bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)]
              rounded-md p-6 sticky top-8
            ">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Reservation Summary</h2>
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Customer Name</span>
                  <span className="text-sm font-semibold text-gray-900">{customerDetails.fullName || '-'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Phone Number</span>
                  <span className="text-sm font-semibold text-gray-900">{customerDetails.phoneNumber || '-'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Date & Time</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reservationDetails.selectedDate ? new Date(reservationDetails.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'} at {selectedTimeSlot?.time || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Number of People</span>
                  <span className="text-sm font-semibold text-gray-900">{customerDetails.numberOfPeople}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Products Selected</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedProductsForSummary.length} products</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-sm text-gray-600">Estimated Value</span>
                  <span className="text-lg font-bold text-primary-500">₹{estimatedValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-semibold text-success-500">Auto-Confirmed ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Actions (now part of the form flow, not fixed to viewport) */}
        <div className="
          w-full
          bg-white border-t-2 border-gray-200 py-6 px-8 mt-6
          flex justify-end gap-3
          shadow-md
        ">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmittingReservation}>Cancel</Button>
          <Button variant="secondary" type="button" disabled={isSubmittingReservation}>Save as Draft</Button>
          <Button
            className="bg-gradient-to-r from-primary-500 to-[#764ba2] hover:opacity-90"
            type="submit"
            disabled={isSubmittingReservation}
          >
            <span>✓</span> {isSubmittingReservation ? 'Creating...' : 'Create Reservation'}
          </Button>
        </div>
      </form>
      {reservationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {reservationError}</span>
        </div>
      )}
    </div>
  );
};

export default CreateManualBookingPage;