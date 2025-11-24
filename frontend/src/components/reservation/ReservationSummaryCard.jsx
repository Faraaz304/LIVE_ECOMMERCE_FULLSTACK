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
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
         <span className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <Receipt size={16} /> Booking Summary
         </span>
         <span className="text-xs text-background/70 bg-background/10 px-2 py-0.5 rounded backdrop-blur-sm">Draft</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div className="flex items-start gap-4">
          <div className="bg-muted p-2 rounded-full text-muted-foreground mt-0.5">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Customer</p>
            {customerDetails.fullName ? (
              <>
                <p className="text-sm font-semibold text-foreground">{customerDetails.fullName}</p>
                <p className="text-xs text-muted-foreground">{customerDetails.phoneNumber}</p>
              </>
            ) : (
               <p className="text-sm text-muted-foreground italic">Not entered yet</p>
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Date & Time Info */}
        <div className="flex items-start gap-4">
          <div className="bg-muted p-2 rounded-full text-muted-foreground mt-0.5">
            <CalendarClock size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Scheduled For</p>
             {reservationDetails.selectedDate && reservationDetails.selectedTimeSlot ? (
              <>
                <p className="text-sm font-semibold text-foreground">{reservationDetails.selectedDate}</p>
                <p className="text-sm font-bold text-blue-600 bg-blue-500/10 border border-blue-500/20 inline-block px-2 py-0.5 rounded mt-1">
                  {reservationDetails.selectedTimeSlot.time}
                </p>
              </>
            ) : (
               <p className="text-sm text-muted-foreground italic">Select date & time</p>
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Product Info */}
        <div className="flex items-start gap-4">
          <div className="bg-muted p-2 rounded-full text-muted-foreground mt-0.5">
            <ShoppingBag size={16} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Interest List</p>
              {selectedProductsCount > 0 && (
                <span className="text-[10px] bg-foreground text-background px-1.5 rounded-full min-w-[1.25rem] text-center font-bold">
                  {selectedProductsCount}
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-baseline bg-muted/30 p-3 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground">Est. Value</span>
              <span className="text-lg font-bold text-foreground">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Display */}
      {submitError && (
        <div className="bg-destructive/10 border-t border-destructive/20 p-4 flex items-start gap-2 text-destructive text-xs">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
};

export default ReservationSummaryCard;