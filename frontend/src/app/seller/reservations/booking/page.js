'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/hooks/useReservation'; // Imported Hook
import useProducts from '@/hooks/useProducts';
import { CalendarCheck, Users, Package, ChevronRight, Save, X } from 'lucide-react';

// Import the sub-components
import CustomerDetailsCard from '@/components/reservation/CustomerDetailsCard';
import ReservationDetailsCard from '@/components/reservation/ReservationDetailsCard';
import ProductSelectionCard from '@/components/reservation/ProductSelectionCard';

const CreateManualBookingPage = () => {
  const router = useRouter();

  // 1. USE HOOKS
  const { products, isLoading: isLoadingProducts, getAllProducts, error: productsError } = useProducts();
  // Use the new hook for creation
  const { createReservation, isLoading: isSubmitting, error: reservationError } = useReservation();

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    numberOfPeople: 1,
  });

  const [reservationDetails, setReservationDetails] = useState({
    selectedDate: '',
    selectedTimeSlot: null, 
  });

  const [productSelection, setProductSelection] = useState({
    searchTerm: '',
    selectedProductIds: new Set(),
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  // --- GENERATE TIME SLOTS ---
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 9; 
    const endHour = 20; 
    let idCounter = 1;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === endHour && minute > 0) break;

        const period = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour;
        if (hour > 12) displayHour = hour - 12;
        if (hour === 0) displayHour = 12; 

        const displayMinute = minute.toString().padStart(2, '0');
        const timeString = `${displayHour}:${displayMinute} ${period}`;

        slots.push({
          id: `slot-${idCounter++}`,
          time: timeString,
          rawHour: hour,
          rawMinute: minute,
          isAvailable: true,
        });
      }
    }
    return slots;
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    let currentProducts = products;
    if (productSelection.searchTerm) {
      const lowerCaseSearch = productSelection.searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(p =>
        p.name?.toLowerCase().includes(lowerCaseSearch) ||
        p.sku?.toLowerCase().includes(lowerCaseSearch)
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

  const selectedProductsForSummary = products.filter(p => productSelection.selectedProductIds.has(p.id));
  const estimatedValue = selectedProductsForSummary.reduce((sum, p) => sum + p.rawPrice, 0);

  // --- SUBMIT HANDLER USING HOOK ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !reservationDetails.selectedDate || !reservationDetails.selectedTimeSlot) {
      alert('Please fill in all required fields: Full Name, Phone Number, Date, and Time.');
      return;
    }

    const productIdsArray = Array.from(productSelection.selectedProductIds);

    const reservationPayload = {
      customerName: customerDetails.fullName,
      customerPhone: customerDetails.phoneNumber,
      customerEmail: customerDetails.email || "", 
      productIds: productIdsArray,                
      date: reservationDetails.selectedDate,      
      time: reservationDetails.selectedTimeSlot.time 
    };

    console.log("Submitting Payload:", JSON.stringify(reservationPayload, null, 2));

    // USE THE HOOK HERE
    const result = await createReservation(reservationPayload);

    if (result.success) {
      alert('Reservation created successfully!');
      router.push('/seller/reservations');
    } else {
      // Error is already handled in hook state, but we can alert specifically here
      alert(`Failed to create reservation: ${result.error}`);
    }
  };

  if (isLoadingProducts) return <div className="h-screen flex items-center justify-center text-gray-500">Loading products...</div>;
  if (productsError) return <div className="h-screen flex items-center justify-center text-red-500">Error: {productsError}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
        <div className="max-w-screen-xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/seller/reservations" className="hover:text-primary-600 transition-colors">Reservations</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Create Manual</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Create Manual Reservation</h1>
          <p className="text-gray-500 mt-1">Enter customer details and schedule an appointment.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-8">
              <CustomerDetailsCard
                customerDetails={customerDetails}
                handleCustomerChange={handleCustomerChange}
                handleNumberOfPeopleChange={handleNumberOfPeopleChange}
                isSubmittingReservation={isSubmitting}
              />

              <ReservationDetailsCard
                reservationDetails={reservationDetails}
                setReservationDetails={setReservationDetails}
                timeSlots={timeSlots} 
                isSubmittingReservation={isSubmitting}
              />

              <ProductSelectionCard
                productSelection={productSelection}
                setProductSelection={setProductSelection}
                products={products}
                filteredProducts={filteredProducts}
                isSubmittingReservation={isSubmitting}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-8 shadow-sm border border-gray-200 ring-1 ring-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="bg-primary-50 text-primary-600 p-1 rounded">📋</span> 
                  Reservation Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Customer</p>
                      <p className="text-sm font-semibold text-gray-900">{customerDetails.fullName || 'Not entered'}</p>
                      <p className="text-xs text-gray-500">{customerDetails.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <CalendarCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date & Time</p>
                      <p className="text-sm font-semibold text-gray-900">{reservationDetails.selectedDate || 'Select Date'}</p>
                      <p className="text-sm font-bold text-primary-600">
                        {reservationDetails.selectedTimeSlot ? reservationDetails.selectedTimeSlot.time : 'Select Time'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Products</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selectedProductsForSummary.length}</span>
                      </div>
                      <div className="mt-1 flex justify-between items-baseline">
                        <span className="text-sm text-gray-600">Estimated Value</span>
                        <span className="text-lg font-bold text-gray-900">₹{estimatedValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {reservationError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    {reservationError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 mb-12 py-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-4">
            <span className="text-sm text-gray-500 mr-auto hidden sm:block">
              * Reservation will be set to 'Pending' status automatically.
            </span>
            
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"

            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <span className="flex items-center gap-2">
                   Create Reservation <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualBookingPage;