// app/(auth)/layout.js

// Metadata for auth pages (optional, can be moved to page.js if preferred per page)
export const metadata = {
  title: 'Register - ShopLive Seller',
  description: 'Register for a new ShopLive Seller account.',
};

export default function AuthLayout({ children }) {
  return (
    // The main layout from RootLayout in app/layout.js already provides body.
    // This layout is a wrapper *within* that body.
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* You can add a common auth header/logo here if needed */}
      {children}
    </div>
  );
}