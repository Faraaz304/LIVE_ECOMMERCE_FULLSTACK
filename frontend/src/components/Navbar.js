"use client";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ toggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.body.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-[var(--card)] text-[var(--foreground)] flex items-center justify-between px-6 py-3 shadow-sm border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-full hover:bg-[var(--secondary)] transition-colors">
          <Menu className="h-6 w-6 text-[var(--foreground)]" />
        </button>
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] w-80 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[var(--primary)]"></span>
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="rounded-full w-9 h-9 border-2 border-[var(--border)] cursor-pointer"
        />
      </div>
    </nav>
  );
}