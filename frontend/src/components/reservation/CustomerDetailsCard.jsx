import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CustomerDetailsCard = ({ customerDetails, handleCustomerChange, handleNumberOfPeopleChange, isSubmittingReservation }) => {
  return (
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
            disabled={isSubmittingReservation}
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
              disabled={isSubmittingReservation}
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
              disabled={isSubmittingReservation}
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
            disabled={isSubmittingReservation}
          />
          <span className="text-xs text-gray-500">How many people will visit</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;