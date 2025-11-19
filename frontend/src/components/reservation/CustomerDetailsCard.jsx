import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CustomerDetailsCard = ({ customerDetails, handleCustomerChange, isSubmittingReservation }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <span>👤</span> Customer Details
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Enter the details of the customer making the reservation
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="e.g. John Doe"
            value={customerDetails.fullName}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="e.g. 9876543210"
            value={customerDetails.phoneNumber}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. john@example.com"
            value={customerDetails.email}
            onChange={handleCustomerChange}
            disabled={isSubmittingReservation}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;