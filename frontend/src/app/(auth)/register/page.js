'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

const RegisterPage = () => {
  const router = useRouter();
  const { register, isSubmitting, submitError, successMessage, clearMessages } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const result = await register(formData.username, formData.email, formData.password, formData.role);
    if (result) {
      setFormData({ username: '', email: '', password: '', role: 'USER' });
      setTimeout(() => {
        if (result.role === 'USER') router.push('/user/dashboard');
        else if (result.role === 'SELLER') router.push('/seller/dashboard');
        else router.push('/login');
      }, 0);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[450px] gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        
        {/* Username */}
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            required
            disabled={isSubmitting}
            value={formData.username}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
            disabled={isSubmitting}
            value={formData.password}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Role Selection Cards */}
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Buyer Card */}
            <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50 ${formData.role === 'USER' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
              <input 
                type="radio" 
                name="role" 
                value="USER" 
                checked={formData.role === 'USER'} 
                onChange={handleInputChange}
                className="hidden"
              />
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span className="font-semibold text-sm">Buy</span>
            </label>
            
            {/* Seller Card */}
            <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50 ${formData.role === 'SELLER' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
              <input 
                type="radio" 
                name="role" 
                value="SELLER" 
                checked={formData.role === 'SELLER'} 
                onChange={handleInputChange}
                className="hidden"
              />
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <span className="font-semibold text-sm">Sell</span>
            </label>
          </div>
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
          className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;