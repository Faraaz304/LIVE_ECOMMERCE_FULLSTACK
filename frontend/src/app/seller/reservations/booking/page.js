'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Removed: Calendar, Popover, PopoverTrigger
// Removed: format from 'date-fns' (ensure date-fns is not solely for this if you remove it)
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for conditional classnames

// Mock data for demonstration
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

const mockProducts = [
  { id: 'p1', name: 'iPhone 14 128GB', sku: 'IPH14-128-BLK', price: 79999, imageUrl: 'https://via.placeholder.com/60', meta: 'Space Black • 128GB Storage' },
  { id: 'p2', name: 'Samsung Galaxy S23', sku: 'SAMS23-256-PHNTM', price: 74999, imageUrl: 'https://via.placeholder.com/60', meta: 'Phantom Black • 256GB' },
  { id: 'p3', name: 'OnePlus 11 5G', sku: 'OP11-256-TITAN', price: 56999, imageUrl: 'https://via.placeholder.com/60', meta: 'Titan Black • 256GB' },
  { id: 'p4', name: 'AirPods Pro (2nd Gen)', sku: 'AIRPODSPRO2', price: 24900, imageUrl: 'https://via.placeholder.com/60', meta: 'White • Active Noise Cancellation' },
  { id: 'p5', name: 'Google Pixel 7 Pro', sku: 'PIX7PRO-128-OBS', price: 84999, imageUrl: 'https://via.placeholder.com/60', meta: 'Obsidian • 128GB' },
];

const CreateManualBookingPage = () => {
  const router = useRouter();

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    numberOfPeople: 1,
  });

  const [reservationDetails, setReservationDetails] = useState({
    selectedDate: '', // Reverted to string for <input type="date">
    selectedTimeSlotId: null,
  });

  const [productSelection, setProductSelection] = useState({
    searchTerm: '',
    selectedProductIds: new Set(),
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    specialRequests: '',
    internalNotes: '',
  });

  const [confirmationSettings, setConfirmationSettings] = useState({
    sendSms: true,
    sendWhatsapp: true,
    sendEmail: false,
  });

  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // Update filtered products based on search term
  useEffect(() => {
    if (productSelection.searchTerm) {
      const lowerCaseSearchTerm = productSelection.searchTerm.toLowerCase();
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.sku.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(mockProducts);
    }
  }, [productSelection.searchTerm]);


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberOfPeopleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCustomerDetails(prev => ({ ...prev, numberOfPeople: isNaN(value) ? 1 : value }));
  };

  const handleTimeSlotSelect = (id, isAvailable) => {
    if (isAvailable) {
      setReservationDetails(prev => ({
        ...prev,
        selectedTimeSlotId: prev.selectedTimeSlotId === id ? null : id, // Toggle selection
      }));
    }
  };

  const handleProductSearchChange = (e) => {
    setProductSelection(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleProductSelect = (productId) => {
    setProductSelection(prev => {
      const newSelected = new Set(prev.selectedProductIds);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return { ...prev, selectedProductIds: newSelected };
    });
  };

  const handleRemoveSelectedProduct = (productId) => {
    setProductSelection(prev => {
      const newSelected = new Set(prev.selectedProductIds);
      newSelected.delete(productId);
      return { ...prev, selectedProductIds: newSelected };
    });
  };

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmationChange = (name, checked) => {
    setConfirmationSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Summary calculations
  const selectedTimeSlot = mockTimeSlots.find(slot => slot.id === reservationDetails.selectedTimeSlotId);
  const selectedProducts = mockProducts.filter(p => productSelection.selectedProductIds.has(p.id));
  const estimatedValue = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !reservationDetails.selectedDate || !reservationDetails.selectedTimeSlotId) {
      alert('Please fill in all required fields (Full Name, Phone Number, Date, Time Slot).');
      return;
    }

    const bookingData = {
      customerDetails,
      reservationDetails: {
        selectedDate: reservationDetails.selectedDate,
        selectedTimeSlotId: reservationDetails.selectedTimeSlotId,
      },
      selectedProductIds: Array.from(productSelection.selectedProductIds),
      additionalInfo,
      confirmationSettings,
    };
    console.log('Creating manual booking:', bookingData);
    alert('Reservation created successfully! (See console for data)');
    // In a real app, you'd send this to your backend
    // router.push('/seller/reservations'); // Redirect after successful booking
  };

  return (
    // Removed md:ml-[260px] from here. SellerLayout's <main> element will apply it.
    // Also removed min-h-screen to prevent double scrollbars.
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span>👤</span> Customer Details
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Enter customer information for the reservation
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Full Name <span className="text-error-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter customer name"
                    value={customerDetails.fullName}
                    onChange={handleCustomerChange}
                    required
                  />
                  <span className="text-xs text-gray-500">First and last name</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Phone Number <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400">📞</span>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={customerDetails.phoneNumber}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <span className="text-xs text-gray-500">10-digit mobile number</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400">✉️</span>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="customer@email.com"
                      className="pl-10"
                      value={customerDetails.email}
                      onChange={handleCustomerChange}
                    />
                  </div>
                  <span className="text-xs text-gray-500">For email notifications</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="numberOfPeople" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Number of People
                  </label>
                  <Input
                    type="number"
                    id="numberOfPeople"
                    name="numberOfPeople"
                    value={customerDetails.numberOfPeople}
                    onChange={handleNumberOfPeopleChange}
                    min="1"
                    max="10"
                  />
                  <span className="text-xs text-gray-500">How many people will visit</span>
                </div>
              </CardContent>
            </Card>

            {/* Reservation Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span>📅</span> Reservation Details
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Select date and time for the visit
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="selectedDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Select Date <span className="text-error-500">*</span>
                  </label>
                  {/* Reverted to native date input */}
                  <Input
                    type="date"
                    id="selectedDate"
                    name="selectedDate"
                    value={reservationDetails.selectedDate}
                    onChange={e => setReservationDetails(prev => ({ ...prev, selectedDate: e.target.value }))}
                    required
                    className="w-full" // Ensure it takes full width
                  />
                  <span className="text-xs text-gray-500">Choose a date for the reservation</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Select Time Slot <span className="text-error-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">Available time slots for the selected date</span>

                  <div className="grid grid-cols-fill-140 gap-3 mt-4">
                    {mockTimeSlots.map(slot => (
                      <div
                        key={slot.id}
                        className={cn(
                          "p-3 border-2 rounded-md text-center cursor-pointer transition-all",
                          slot.id === reservationDetails.selectedTimeSlotId
                            ? "border-primary-500 bg-primary-500 text-white"
                            : slot.isAvailable
                              ? "border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-500/[0.05]"
                              : "border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
                        )}
                        onClick={() => handleTimeSlotSelect(slot.id, slot.isAvailable)}
                      >
                        <div className="font-semibold text-sm mb-1">{slot.time}</div>
                        <div className="text-xs">{slot.capacity} spots left</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span>🛍️</span> Product Selection (Optional)
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Select products the customer is interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    className="pr-10"
                    value={productSelection.searchTerm}
                    onChange={handleProductSearchChange}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={cn(
                        "flex gap-4 p-4 border-2 rounded-md cursor-pointer transition-all",
                        productSelection.selectedProductIds.has(product.id)
                          ? "border-primary-500 bg-primary-500/[0.05]"
                          : "border-gray-200 hover:border-primary-500 hover:bg-primary-500/[0.02]"
                      )}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <Checkbox
                        checked={productSelection.selectedProductIds.has(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        className="mt-1"
                      />
                      <img src={product.imageUrl} alt={product.name} className="w-[60px] h-[60px] rounded-md object-cover border border-gray-200" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 mb-1">{product.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{product.meta}</div>
                        <div className="font-bold text-base text-primary-500">₹{product.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProducts.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Selected Products ({selectedProducts.length}):
                    </div>
                    <div>
                      {selectedProducts.map(product => (
                        <span key={product.id} className="
                          inline-flex items-center gap-2 px-3 py-2 rounded-full
                          bg-primary-500 text-white text-xs mr-2 mb-2
                        ">
                          {product.name}
                          <span
                            className="font-bold cursor-pointer"
                            onClick={() => handleRemoveSelectedProduct(product.id)}
                          >
                            ✕
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Requests Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span>📝</span> Additional Information
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Add any special requests or notes about this reservation
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="specialRequests" className="text-sm font-semibold text-gray-700">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm min-h-[100px] resize-y transition-all focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="Any specific requirements from the customer? (e.g., interested in trade-in, needs demo, specific color preference)"
                    value={additionalInfo.specialRequests}
                    onChange={handleAdditionalInfoChange}
                  ></textarea>
                  <span className="text-xs text-gray-500">Customer's special requests or preferences</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="internalNotes" className="text-sm font-semibold text-gray-700">
                    Internal Notes (Optional)
                  </label>
                  <textarea
                    id="internalNotes"
                    name="internalNotes"
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm min-h-[100px] resize-y transition-all focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                    placeholder="Add internal notes about this booking (e.g., 'Phone inquiry', 'Walk-in customer', 'Returning customer')"
                    value={additionalInfo.internalNotes}
                    onChange={handleAdditionalInfoChange}
                  ></textarea>
                  <span className="text-xs text-gray-500">Private notes for your reference (not visible to customer)</span>
                </div>
              </CardContent>
            </Card>

            {/* Confirmation Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span>🔔</span> Confirmation Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Choose how to notify the customer
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-md">
                  <Checkbox
                    id="sms"
                    checked={confirmationSettings.sendSms}
                    onCheckedChange={(checked) => handleConfirmationChange('sendSms', checked)}
                  />
                  <label htmlFor="sms" className="text-sm text-gray-700 cursor-pointer">
                    <strong>Send SMS Confirmation</strong> - Customer will receive booking details via SMS
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-md">
                  <Checkbox
                    id="whatsapp"
                    checked={confirmationSettings.sendWhatsapp}
                    onCheckedChange={(checked) => handleConfirmationChange('sendWhatsapp', checked)}
                  />
                  <label htmlFor="whatsapp" className="text-sm text-gray-700 cursor-pointer">
                    <strong>Send WhatsApp Confirmation</strong> - Customer will receive booking details on WhatsApp
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-md">
                  <Checkbox
                    id="email"
                    checked={confirmationSettings.sendEmail}
                    onCheckedChange={(checked) => handleConfirmationChange('sendEmail', checked)}
                    disabled={!customerDetails.email}
                  />
                  <label htmlFor="email" className="text-sm text-gray-700 cursor-pointer">
                    <strong>Send Email Confirmation</strong> - Customer will receive booking details via email (requires email address)
                  </label>
                </div>
              </CardContent>
            </Card>
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
                  <span className="text-sm font-semibold text-gray-900">{selectedProducts.length} products</span>
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
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button variant="secondary" type="button">Save as Draft</Button>
          <Button
            className="bg-gradient-to-r from-primary-500 to-[#764ba2] hover:opacity-90"
            type="submit"
          >
            <span>✓</span> Create Reservation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateManualBookingPage;