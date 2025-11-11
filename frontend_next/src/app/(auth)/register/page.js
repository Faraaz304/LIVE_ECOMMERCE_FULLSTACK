// app/(auth)/register/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role set to 'user'
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

    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setSubmitError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8084/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure 'role' is included here
      });

      const responseText = await response.text();
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Backend responded with non-JSON text on register:', responseText, parseError);
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Server error: ${response.status} ${response.statusText}. Response body: ${responseText}`);
      }

      if (result && result.token) {
        console.log('Registration successful:', result);
        // --- IMPORTANT: Handle tokens securely ---
        // For a real application, you would store `result.token` and `result.refreshToken`
        // in secure HTTP-only cookies or a secure state management solution.
        // Direct localStorage storage is generally not recommended for security reasons.
        // For demonstration purposes:
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('userEmail', result.email); // Store email for display
        localStorage.setItem('userRole', result.role); // Store role for display/client-side checks

        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        throw new Error('Registration successful but no token received. Please try logging in.');
      }

    } catch (err) {
      console.error('Error during registration:', err);
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Register for ShopLive</h1>
        <p className="text-sm text-[#6b7280]">Create your seller account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#374151] mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

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

        {/* New Role Selection Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#374151] mb-2" htmlFor="role">
            Register as
          </label>
          <select
            id="role"
            name="role"
            className="w-full px-4 py-2 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
            value={formData.role}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            {/* The 'admin' role is intentionally excluded from the UI */}
          </select>
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
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-[#6b7280] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#667eea] font-semibold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;