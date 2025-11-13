// app/(auth)/login/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || null;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setSubmitError('Please enter your email and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8084';
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const responseText = await response.text();
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Backend responded with non-JSON text on login:', responseText, parseError);
          throw new Error(`Login failed. Server responded with: ${responseText.substring(0, 100)}`);
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Login failed. Server error: ${response.status} ${response.statusText}.`);
      }

      // --- IMPORTANT: Token Handling ---
      // Your backend MUST set HttpOnly, Secure cookies upon successful login.
      // This client-side JavaScript should NOT store accessToken in localStorage directly.
      // It's acceptable to store non-sensitive user details like email/role in localStorage
      // for client-side display or quick checks, but not for authentication itself.

      if (result && result.email && result.role) {
        localStorage.setItem('userEmail', result.email);
        localStorage.setItem('userRole', result.role);

        setSuccessMessage('Login successful! Redirecting...');

        setFormData({ email: '', password: '' });

        // console.log(localStorage.getItem('userRole'));
        setTimeout(() => {
          // Priority: Redirect to the original path if it exists
          if (redirectPath) {
            router.push(redirectPath);
          } else if (result.role === 'USER') {
            router.push('/user/dashboard'); // Redirect regular users to their product list within (user) group
          } else if (result.role === 'ADMIN') {
            router.push('/admin/dashboard'); // Redirect admins to their dashboard within (admin) group
          } else if (result.role === 'SELLER') {
            router.push('/seller/dashboard'); // Redirect sellers to their dashboard within (seller) group
          } 
        }, 1500);
      } else {
        throw new Error('Login successful but missing user details (email/role).');
      }

    } catch (err) {
      console.error('Error during login:', err);
      setSubmitError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Welcome Back!</h1>
        <p className="text-sm text-[#6b7280]">Login to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#374151] mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#374151] mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {submitError && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg p-3 mb-4 text-center">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] rounded-lg p-3 mb-4 text-center">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging In...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-[#6b7280] mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-[#667eea] font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;