'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth'; 

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || null;
  const { login, isSubmitting, submitError, successMessage, clearMessages } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    clearMessages();
  }, [clearMessages, redirectPath]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const result = await login(formData.email, formData.password);
    if (result) {
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        if (redirectPath) router.push(redirectPath);
        else if (result.role === 'USER') router.push('/user/dashboard');
        else if (result.role === 'ADMIN') router.push('/admin/dashboard');
        else if (result.role === 'SELLER') router.push('/seller/dashboard');
        else router.push('/');
      }, 0);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[400px] gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isSubmitting}
            value={formData.password}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {submitError && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium text-center">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-sm text-green-600 dark:text-green-400 font-medium text-center">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;