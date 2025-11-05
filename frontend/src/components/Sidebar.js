"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Users,
  Calendar, 
  Tv, 
  Settings 
} from "lucide-react";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Products", icon: <Package size={20} />, href: "/product" },
    { name: "Orders", icon: <ShoppingCart size={20} />, href: "/orders" },
    { name: "Customers", icon: <Users size={20} />, href: "/customers" },
    { name: "Reservation", icon: <Calendar size={20} />, href: "/reservation" },
    { name: "Stream", icon: <Tv size={20} />, href: "/stream" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <motion.aside
      animate={{ x: isOpen ? 0 : -250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[var(--card)] text-[var(--foreground)] w-64 h-screen fixed md:static top-0 left-0 flex flex-col p-4 shadow-lg border-r border-[var(--border)] z-50"
    >
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-semibold text-[var(--primary)]">
          LiveCommerce
        </h2>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]"
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-3 p-2 border-t border-[var(--border)]">
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="rounded-full w-10 h-10 border-2 border-[var(--border)]"
          />
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-[var(--muted-foreground)]">johndoe@example.com</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

