"use client";

import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Users,
  Camera,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/lecturer/dashboard" },
  { name: "Courses", icon: BookOpen, path: "/lecturer/courses" },
  { name: "Students", icon: Users, path: "/lecturer/students" },
  { name: "Take Attendance", icon: Camera, path: "/lecturer/attendance" },
  { name: "Sessions", icon: Calendar, path: "/lecturer/sessions" },
  { name: "Records", icon: Calendar, path: "/lecturer/records" },
  { name: "Reports", icon: BarChart3, path: "/lecturer/reports" },
  { name: "Notifications", icon: Bell, path: "/lecturer/notifications" },
  { name: "Profile", icon: User, path: "/lecturer/profile" },
  { name: "Settings", icon: Settings, path: "/lecturer/settings" },
];

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-indigo-400 mb-8"
        >
          Lecturer Panel
        </motion.h1>

        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer border border-white/10 transition ${
                  isActive ? "bg-indigo-600" : "bg-white/5 hover:bg-slate-800"
                }`}
              >
                <Icon className="text-indigo-400" size={18} />
                <span className="text-sm">{item.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
