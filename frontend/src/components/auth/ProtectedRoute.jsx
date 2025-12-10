'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children, role }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();
  const { fetchUserById } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const validateUser = async () => {
      try {
        const userid = localStorage.getItem("userid");
        if (!userid) {
          router.replace("/login");
          return;
        }

        const user = await fetchUserById(userid);
        if (!user) {
          router.replace("/login");
          return;
        }

        // Check role
        if (role && user.role !== role) {
          router.replace("/login");
          return;
        }

        setAuthorized(true);

      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [mounted]);

  if (!mounted || loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!authorized) return null;

  return children;
}
