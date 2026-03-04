"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      href: "/student/dashboard",
    },
    {
      label: "My Courses",
      icon: <BookOpen size={18} />,
      href: "/student/dashboard/courses",
    },
    {
      label: "Attendance",
      icon: <CalendarCheck size={18} />,
      href: "/student/dashboard/attendance",
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      href: "/student/dashboard/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 top-0 left-0 h-screen w-64 bg-slate-900 border-r border-white/10 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-8 text-indigo-400">
          Student Panel
        </h2>

        <nav className="space-y-4">
          {sidebarItems.map((item) => (
            <SidebarItem
              href={item.href}
              key={item.label}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="absolute bottom-6 left-6">
          <Button variant="ghost" className="text-red-400 hover:text-red-500">
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-2xl font-semibold">Student Dashboard</h1>

          <div className="bg-white/10 px-4 py-2 rounded-xl text-sm">
            Welcome, John 👋
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Item ---------------- */
function SidebarItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
