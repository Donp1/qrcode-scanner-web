"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BookOpen, FileText, ClipboardCheck } from "lucide-react";

type AttendanceType = "Class" | "Test" | "Exam";
type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  type: AttendanceType;
  title: string;
}

const mockData: AttendanceRecord[] = [
  {
    date: "2026-03-25",
    status: "Present",
    type: "Class",
    title: "CSC301 Lecture",
  },
  {
    date: "2026-03-26",
    status: "Absent",
    type: "Test",
    title: "CSC307 Quiz 1",
  },
  {
    date: "2026-03-27",
    status: "Late",
    type: "Class",
    title: "GST301 Tutorial",
  },
  {
    date: "2026-03-28",
    status: "Present",
    type: "Exam",
    title: "Mid Semester Exam",
  },
  {
    date: "2026-03-29",
    status: "Present",
    type: "Test",
    title: "CSC309 CA Test",
  },
];

const tabs: AttendanceType[] = ["Class", "Test", "Exam"];

export default function AttendanceSection() {
  const [records] = useState<AttendanceRecord[]>(mockData);
  const [activeTab, setActiveTab] = useState<AttendanceType>("Class");

  const filtered = useMemo(
    () => records.filter((r) => r.type === activeTab),
    [records, activeTab],
  );

  const presentCount = filtered.filter((r) => r.status === "Present").length;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-950 min-h-screen text-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        Attendance Dashboard
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              activeTab === tab
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-white/5 border-white/10 text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <StatCard title={`${activeTab} Records`} value={filtered.length} />
        <StatCard title="Present" value={presentCount} />
        <StatCard
          title="Attendance %"
          value={`${Math.round(
            (presentCount / (filtered.length || 1)) * 100,
          )}%`}
        />
      </motion.div>

      {/* Records */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-lg font-semibold mb-4 text-indigo-300">
          {activeTab} Attendance Records
        </h2>

        <div className="space-y-3">
          {filtered.map((record, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center px-4 py-3 bg-slate-900 border border-white/10 rounded hover:bg-slate-800"
            >
              <div>
                <p className="text-gray-200 font-medium">{record.title}</p>
                <p className="text-gray-400 text-sm">{record.date}</p>
              </div>

              <StatusBadge status={record.status} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* Stats Card */
function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4"
    >
      <span className="text-sm text-gray-400">{title}</span>
      <div className="text-xl font-bold text-indigo-400">{value}</div>
    </motion.div>
  );
}

/* Status Badge */
function StatusBadge({ status }: { status: AttendanceStatus }) {
  const styles = {
    Present: "bg-green-500/10 text-green-400",
    Absent: "bg-red-500/10 text-red-400",
    Late: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
