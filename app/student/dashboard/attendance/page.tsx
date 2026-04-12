"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent" | "Late";
}

const mockData: AttendanceRecord[] = [
  { date: "2026-03-25", status: "Present" },
  { date: "2026-03-26", status: "Absent" },
  { date: "2026-03-27", status: "Late" },
  { date: "2026-03-28", status: "Present" },
];

export default function AttendanceSection() {
  const [records] = useState<AttendanceRecord[]>(mockData);

  const presentCount = records.filter((r) => r.status === "Present").length;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-950 min-h-screen text-white rounded-lg">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        Attendance Dashboard
      </motion.h1>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <StatCard title="Total Classes" value={records.length} />
        <StatCard title="Present" value={presentCount} />
        <StatCard
          title="Attendance %"
          value={`${Math.round((presentCount / records.length) * 100)}%`}
        />
      </motion.div>

      {/* Records */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 p-6 rounded-lg border border-white/10 shadow-md"
      >
        <h2 className="text-lg font-semibold mb-4 text-indigo-300">
          Recent Records
        </h2>

        <div className="space-y-3">
          {records.map((record, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center px-4 py-3 bg-slate-900 border border-white/10 rounded hover:bg-slate-800 transition"
            >
              <span className="text-gray-300">{record.date}</span>
              <StatusBadge status={record.status} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4 shadow-md"
    >
      <span className="text-sm text-gray-400">{title}</span>
      <div className="text-xl font-bold text-indigo-400">{value}</div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Present: "bg-green-500/10 text-green-400",
    Absent: "bg-red-500/10 text-red-400",
    Late: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
}
