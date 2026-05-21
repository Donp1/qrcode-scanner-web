"use client";

import { useState, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { StudentProvider, useStudent } from "@/context/student-context";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <StudentProvider>
      <DashboardShell>{children}</DashboardShell>
    </StudentProvider>
  );
}

function DashboardShell({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { student, loading } = useStudent();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.replace("/student");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <span className="text-lg font-medium animate-bounce">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* ================= MOBILE OVERLAY ================= */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
    fixed top-0 left-0 z-50
    min-h-screen w-[280px]
    bg-slate-900/95
    backdrop-blur-xl
    border-r border-white/10
    flex flex-col
    transition-transform duration-300 ease-in-out

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

    md:translate-x-0
    md:sticky
    md:top-0
    md:self-start
  `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Student Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Learning Management</p>
          </div>

          {/* Close button mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="
              w-full justify-start
              text-red-400 hover:text-red-300
              hover:bg-red-500/10
            "
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ================= TOPBAR ================= */}
        <header
          className="
            sticky top-0 z-20
            bg-slate-950/80
            backdrop-blur-xl
            border-b border-white/10
          "
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="
                  md:hidden
                  p-2 rounded-xl
                  bg-white/5 border border-white/10
                  hover:bg-white/10
                  transition
                "
              >
                <Menu size={22} />
              </button>

              <div>
                <h1 className="text-lg sm:text-2xl font-semibold">
                  Student Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  Manage your courses and attendance
                </p>
              </div>
            </div>

            {/* Right */}
            <div
              className="
                hidden sm:flex
                items-center gap-3
                bg-white/5
                border border-white/10
                px-4 py-2 rounded-2xl
              "
            >
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                {student?.name?.charAt(0)?.toUpperCase() ?? "S"}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-medium">
                  {student?.name ?? "Student"}
                </p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3
        px-4 py-3 rounded-2xl
        transition-all duration-200
        border
        ${
          active
            ? "bg-indigo-500/15 text-white border-indigo-500/30"
            : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <div
        className={`
          transition
          ${active ? "text-indigo-400" : "group-hover:text-white"}
        `}
      >
        {icon}
      </div>

      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
