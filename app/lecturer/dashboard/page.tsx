"use client";

import { motion } from "framer-motion";
// ---------------- Chart ----------------
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const totalClasses = 42;
  const todayPresent = 56;
  const todayAbsent = 12;

  const recentActivity = [
    "CSC 301 attendance recorded",
    "CSC 305 session started",
    "2 students marked late",
    "Attendance updated for CSC 302",
  ];

  return (
    <div>
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        Dashboard
      </motion.h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Classes Held" value={totalClasses} />
        <StatCard title="Present Today" value={todayPresent} />
        <StatCard title="Absent Today" value={todayAbsent} />
        <StatCard
          title="Attendance Rate"
          value={`${Math.round((todayPresent / (todayPresent + todayAbsent)) * 100)}%`}
        />
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Today Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-6 rounded-lg border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">
            Today’s Attendance Summary
          </h2>
          <div className="space-y-3">
            <p className="text-gray-300">
              Present: <span className="text-green-400">{todayPresent}</span>
            </p>
            <p className="text-gray-300">
              Absent: <span className="text-red-400">{todayAbsent}</span>
            </p>
          </div>
        </motion.div>

        {/* Placeholder for Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-6 rounded-lg border border-white/10 flex items-center justify-center"
        >
          <AttendanceChart />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-lg font-semibold mb-4 text-indigo-300">
          Recent Attendance Activity
        </h2>

        <ul className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900 border border-white/10 px-4 py-3 rounded hover:bg-slate-800 transition"
            >
              {activity}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4"
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold text-indigo-400">{value}</p>
    </motion.div>
  );
}

function AttendanceChart() {
  const data = [
    { day: "Mon", present: 50 },
    { day: "Tue", present: 60 },
    { day: "Wed", present: 55 },
    { day: "Thu", present: 70 },
    { day: "Fri", present: 65 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
