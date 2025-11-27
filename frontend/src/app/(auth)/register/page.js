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

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    );

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
          Enter your details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">

        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={isSubmitting}
            value={formData.username}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isSubmitting}
            value={formData.password}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          />
        </div>

        {/* Role Selection */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">I want to</label>
          <div className="grid grid-cols-2 gap-4">

            <label
              className={`cursor-pointer rounded-xl border-2 p-4 text-center transition ${
                formData.role === 'USER'
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="USER"
                checked={formData.role === 'USER'}
                onChange={handleInputChange}
                className="hidden"
              />
              Buyer
            </label>

            <label
              className={`cursor-pointer rounded-xl border-2 p-4 text-center transition ${
                formData.role === 'SELLER'
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="SELLER"
                checked={formData.role === 'SELLER'}
                onChange={handleInputChange}
                className="hidden"
              />
              Seller
            </label>
          </div>
        </div>

        {submitError && (
          <div className="p-3 text-sm text-destructive text-center bg-destructive/10 border">
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="p-3 text-sm text-green-600 text-center bg-green-500/10 border">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-md bg-primary px-8 text-sm text-primary-foreground shadow hover:bg-primary/90"
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
