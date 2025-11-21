import React from 'react';
import { User, CalendarClock, ShoppingBag, Receipt, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ReservationSummaryCard = ({
  customerDetails,
  reservationDetails,
  selectedProductsCount,
  estimatedValue,
  submitError
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
         <span className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <Receipt size={16} /> Booking Summary
         </span>
         <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Draft</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 p-2 rounded-full text-slate-500 mt-0.5">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Customer</p>
            {customerDetails.fullName ? (
              <>
                <p className="text-sm font-semibold text-slate-900">{customerDetails.fullName}</p>
                <p className="text-xs text-slate-500">{customerDetails.phoneNumber}</p>
              </>
            ) : (
               <p className="text-sm text-slate-400 italic">Not entered yet</p>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Date & Time Info */}
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 p-2 rounded-full text-slate-500 mt-0.5">
            <CalendarClock size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Scheduled For</p>
             {reservationDetails.selectedDate && reservationDetails.selectedTimeSlot ? (
              <>
                <p className="text-sm font-semibold text-slate-900">{reservationDetails.selectedDate}</p>
                <p className="text-sm font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                  {reservationDetails.selectedTimeSlot.time}
                </p>
              </>
            ) : (
               <p className="text-sm text-slate-400 italic">Select date & time</p>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Product Info */}
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 p-2 rounded-full text-slate-500 mt-0.5">
            <ShoppingBag size={16} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Interest List</p>
              {selectedProductsCount > 0 && (
                <span className="text-[10px] bg-slate-900 text-white px-1.5 rounded-full min-w-[1.25rem] text-center">
                  {selectedProductsCount}
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-baseline bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500">Est. Value</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Display */}
      {submitError && (
        <div className="bg-red-50 border-t border-red-100 p-4 flex items-start gap-2 text-red-600 text-xs">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
};

export default ReservationSummaryCard;