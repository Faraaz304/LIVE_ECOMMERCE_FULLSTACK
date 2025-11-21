'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/hooks/useReservation';
import useProducts from '@/hooks/useProducts';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

// Import the sub-components
import CustomerDetailsCard from '@/components/reservation/CustomerDetailsCard';
import ReservationDetailsCard from '@/components/reservation/ReservationDetailsCard';
import ProductSelectionCard from '@/components/reservation/ProductSelectionCard';
import ReservationSummaryCard from '@/components/reservation/ReservationSummaryCard';

const CreateManualBookingPage = () => {
  const router = useRouter();

  // 1. USE HOOKS
  const { products, isLoading: isLoadingProducts, getAllProducts, error: productsError } = useProducts();
  const { createReservation, isLoading: isSubmitting, error: reservationError } = useReservation();

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
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

  const selectedProductsForSummary = products.filter(p => productSelection.selectedProductIds.has(p.id));
  const estimatedValue = selectedProductsForSummary.reduce((sum, p) => sum + p.rawPrice, 0);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone = customerDetails.phoneNumber;
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      alert("Phone number must be 10 digits and numbers only.");
      return;
    }
    
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

    const result = await createReservation(reservationPayload);

    if (result.success) {
      router.push('/seller/products');
    } else {
      alert(`Failed to create reservation: ${result.error}`);
    }
  };

  if (isLoadingProducts) return <div className="h-screen flex items-center justify-center text-slate-500 bg-slate-50">Loading products...</div>;
  if (productsError) return <div className="h-screen flex items-center justify-center text-red-500 bg-slate-50 flex-col gap-2"><AlertCircle /> Error: {productsError}</div>;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">New Reservation</h1>
            <p className="text-xs text-slate-500">Create a manual booking for a walk-in or phone customer</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-8 space-y-8">
              <CustomerDetailsCard
                customerDetails={customerDetails}
                handleCustomerChange={handleCustomerChange}
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

            {/* Right Column: Sticky Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ReservationSummaryCard
                  customerDetails={customerDetails}
                  reservationDetails={reservationDetails}
                  selectedProductsCount={selectedProductsForSummary.length}
                  estimatedValue={estimatedValue}
                  isSubmitting={isSubmitting}
                  submitError={reservationError}
                />
                
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 h-12 text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                       Confirm Reservation <CheckCircle2 className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                <p className="text-xs text-center text-slate-400">
                  By clicking confirm, the reservation status will be set to <strong>Confirmed</strong> automatically.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualBookingPage;