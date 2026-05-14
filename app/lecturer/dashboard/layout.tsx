"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Users,
  Camera,
  Settings,
  User,
  Menu,
  X,
  Bell,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/lecturer/dashboard",
  },
  {
    name: "Courses",
    icon: BookOpen,
    path: "/lecturer/dashboard/courses",
  },
  {
    name: "Students",
    icon: Users,
    path: "/lecturer/dashboard/students",
  },
  // {
  //   name: "Take Attendance",
  //   icon: Camera,
  //   path: "/lecturer/dashboard/attendance",
  // },
  {
    name: "Profile",
    icon: User,
    path: "/lecturer/dashboard/profile",
  },
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/lecturer/dashboard/settings",
  // },
];

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-slate-900 border-r border-white/10 z-50 p-5 lg:hidden"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-indigo-400 text-sm font-medium">
                    Smart Attendance
                  </p>

                  <h1 className="text-xl font-bold">
                    Lecturer Panel
                  </h1>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu */}
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;

                  const isActive = pathname === item.path;

                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition border ${
                        isActive
                          ? "bg-indigo-600 border-indigo-500"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-indigo-400"
                        }
                      />

                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex-col">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-indigo-400 text-sm font-medium mb-2">
            Smart Attendance
          </p>

          <h1 className="text-2xl font-bold">
            Lecturer Panel
          </h1>
        </motion.div>

        {/* Navigation */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            const isActive = pathname === item.path;

            return (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-indigo-400"
                  }
                />

                <span className="font-medium text-sm">
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Card */}
        <div className="mt-auto">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5">
            <p className="text-sm text-indigo-100 mb-2">
              Lecturer Access
            </p>

            <h3 className="text-xl font-bold mb-2">
              Course Management
            </h3>

            <p className="text-sm text-indigo-100 leading-relaxed">
              Manage attendance, students, and analytics for your
              assigned courses.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Topbar */}
        <header className="sticky top-0 z-30 lg:hidden border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs text-indigo-400">
                  Smart Attendance
                </p>

                <h2 className="font-semibold">
                  Lecturer Panel
                </h2>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <Bell size={18} />

                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>

              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                L
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}