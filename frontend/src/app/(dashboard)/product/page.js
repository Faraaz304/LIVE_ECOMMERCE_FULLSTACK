"use client"
import { useState } from "react";
import  Navbar  from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Products from "../../../components/Products";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
     <body className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-all">
        <Sidebar isOpen={isOpen} />
        <div className="flex flex-col flex-1">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 overflow-y-auto">
            <Products/>
          </main>
        </div>
      </body>
    </>
   
  );
}
