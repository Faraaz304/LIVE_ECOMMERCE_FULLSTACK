import React from 'react';
import { Users, CalendarCheck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReservationSummaryCard = ({
  customerDetails,
  reservationDetails,
  selectedProductsCount,
  estimatedValue,
  isSubmitting,
  submitError
}) => {
  return (
    <div className="bg-white rounded-xl p-6 sticky top-8 shadow-sm border border-gray-200 ring-1 ring-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="bg-primary-50 text-primary-600 p-1 rounded">📋</span>
        Reservation Summary
      </h2>

      <div className="space-y-4">
        {/* Customer Info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <Users className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Customer</p>
            <p className="text-sm font-semibold text-gray-900">{customerDetails.fullName || 'Not entered'}</p>
            <p className="text-xs text-gray-500">{customerDetails.phoneNumber}</p>
          </div>
        </div>

        {/* Date & Time Info */}
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

        {/* Product Info */}
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Products</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {selectedProductsCount}
              </span>
            </div>
            <div className="mt-1 flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Estimated Value</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Display */}
      {submitError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {submitError}
        </div>
      )}
    </div>
  );
};

export default ReservationSummaryCard;