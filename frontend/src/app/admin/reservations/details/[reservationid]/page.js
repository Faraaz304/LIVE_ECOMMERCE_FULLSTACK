'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Printer, 
  Loader2,
  AlertCircle
} from 'lucide-react';

import { useReservation } from '@/hooks/useReservation';
import useProducts from '@/hooks/useProducts';

// Import New Components
import CustomerDetailsCard from '@/components/reservation/CustomerViewCard';
import AppointmentInfoCard from '@/components/reservation/AppointmentInfoCard';
import SelectedProductsCard from '@/components/reservation/SelectedProductsCard';

const ReservationDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { reservationid } = params;

  // 1. Hooks
  const { reservations, getAllReservations, isLoading: isLoadingRes } = useReservation();
  const { getProductById } = useProducts();

  // 2. Local State
  const [reservation, setReservation] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 3. Fetch All Reservations on Mount
  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);

  // 4. Find the specific reservation when list is loaded
  useEffect(() => {
    if (reservations.length > 0 && reservationid) {
      const found = reservations.find((r) => String(r.id) === String(reservationid));
      if (found) {
        setReservation(found);
      }
    }
  }, [reservations, reservationid]);

  // 5. Fetch Product Details when Reservation is found
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!reservation) return;

      const rawString = reservation.productName || "";
      
      if (!rawString.includes("Item IDs:") || rawString.includes("No Products")) {
        setSelectedProducts([]);
        return;
      }

      const idsString = rawString.replace("Item IDs: ", "");
      const ids = idsString.split(',').map(id => id.trim()).filter(Boolean);

      if (ids.length === 0) {
        setSelectedProducts([]);
        return;
      }

      setLoadingProducts(true);
      try {
        const productPromises = ids.map((id) => getProductById(id));
        const products = await Promise.all(productPromises);
        setSelectedProducts(products.filter(p => p !== null));
      } catch (err) {
        console.error("Error fetching reservation products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [reservation, getProductById]);

  // --- Helpers ---
  const getFormattedDateTime = (dateStr, timeStr) => {
    if (reservation?.startTime) {
      const date = new Date(reservation.startTime);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
    }
    return { date: dateStr || 'N/A', time: timeStr || 'N/A' };
  };

  const getTotalValue = () => {
    return selectedProducts.reduce((acc, curr) => acc + (curr.rawPrice || 0), 0);
  };

  // --- Loading State ---
  if (isLoadingRes && !reservation) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!isLoadingRes && reservations.length > 0 && !reservation) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-8 bg-card border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Reservation Not Found</h1>
          <p className="text-muted-foreground mb-6">The reservation #{reservationid} does not exist or has been removed.</p>
          <Button onClick={() => router.push('/seller/reservations/booking')} className="w-full">
            Back to Reservations
          </Button>
        </Card>
      </div>
    );
  }

  const { date, time } = getFormattedDateTime(reservation?.date, reservation?.time);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      
      {/* Header / Nav */}
      <div className="bg-background border-b border-border sticky top-0 z-10 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground tracking-tight">
                    Reservation #{reservation?.bookingId?.replace('RES-', '') || reservation?.id}
                  </h1>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                    Confirmed
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Booked on {new Date(reservation?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.print()} className="bg-background border-border hover:bg-muted">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Customer & Appointment */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerDetailsCard 
              customerName={reservation?.customerName}
              customerPhone={reservation?.customerPhone}
              customerEmail={reservation?.customerEmail}
            />
            
            <AppointmentInfoCard 
              date={date}
              time={time}
            />
          </div>

          {/* Right Column: Products */}
          <div className="lg:col-span-1">
            <SelectedProductsCard 
              products={selectedProducts}
              isLoading={loadingProducts}
              totalValue={getTotalValue()}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;