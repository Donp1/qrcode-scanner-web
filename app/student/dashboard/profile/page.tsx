"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  User,
  Mail,
  School,
  Hash,
  CalendarCheck,
  QrCode,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import QRCode from "react-qr-code";

export default function ProfilePage() {
  const [user] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    matric: "CSC/2021/001",
    faculty: "Science",
    department: "Computer Science",
    level: "300",
    status: "Active",
    attendanceRate: 87,
    totalClasses: 120,
    attended: 104,
    courses: ["CSC301", "CSC307", "CSC309", "GST301"],
    lastAttendance: "2026-05-12 09:14 AM",
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-950 min-h-screen text-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        Student Profile
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT: Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 p-6 rounded-lg border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.matric}</p>

              <span
                className={`inline-flex items-center gap-1 mt-1 text-sm ${
                  user.status === "Active" ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.status === "Active" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {user.status}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <ProfileItem icon={<Mail />} label="Email" value={user.email} />
            <ProfileItem icon={<User />} label="Level" value={user.level} />
            <ProfileItem
              icon={<School />}
              label="Faculty"
              value={user.faculty}
            />
            <ProfileItem
              icon={<School />}
              label="Department"
              value={user.department}
            />
            <ProfileItem
              icon={<Hash />}
              label="Matric No"
              value={user.matric}
            />
            <ProfileItem
              icon={<CalendarCheck />}
              label="Last Attendance"
              value={user.lastAttendance}
            />
          </div>
        </motion.div>

        {/* RIGHT: Attendance + QR */}
        <div className="space-y-6">
          {/* QR Code Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col items-center"
          >
            <QRCode value="STUDENT_REG_123456" size={180} />
            <p className="text-sm text-gray-400 mb-3">Student QR Code</p>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Scan this code during lecture attendance
            </p>
          </motion.div>

          {/* Attendance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 p-6 rounded-lg border border-white/10"
          >
            <h3 className="font-semibold mb-4 text-indigo-300">
              Attendance Summary
            </h3>

            <div className="space-y-3 text-sm">
              <Stat label="Total Classes" value={user.totalClasses} />
              <Stat label="Attended" value={user.attended} />
              <Stat label="Missed" value={user.totalClasses - user.attended} />

              <div>
                <p className="text-gray-400">Attendance Rate</p>
                <p className="text-lg font-bold text-indigo-400">
                  {user.attendanceRate}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-indigo-400" />
              <h3 className="font-semibold">Registered Courses</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {user.courses.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded text-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded"
      >
        Edit Profile
      </motion.button>
    </div>
  );
}

/* Reusable Components */
function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-white/10 px-4 py-3 rounded">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
