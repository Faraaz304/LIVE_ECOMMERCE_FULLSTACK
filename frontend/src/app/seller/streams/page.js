'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import DashboardContent from '@/components/stream/DashboardContent';

export default function LiveStreamsPage() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}