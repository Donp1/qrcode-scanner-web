"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

type AttendanceType = "Class" | "Test" | "Exam";
type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceRecord {
  date: string; // raw ISO
  formattedDate: string;
  status: AttendanceStatus;
  type: AttendanceType;
  title: string;
}

const tabs: AttendanceType[] = ["Class", "Test", "Exam"];

export default function AttendanceSection() {
  const [activeTab, setActiveTab] = useState<AttendanceType>("Class");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { loading, recentAttendance } = useStudentAuth();

  // Transform backend data
  const records: AttendanceRecord[] = useMemo(() => {
    if (!recentAttendance) return [];

    return recentAttendance.map((item: any) => {
      const dateObj = new Date(item.date);

      return {
        date: item.date,
        formattedDate: dateObj.toLocaleString(),
        status:
          item.status === "PRESENT"
            ? "Present"
            : item.status === "ABSENT"
              ? "Absent"
              : "Late",
        type:
          item.type === "CLASS"
            ? "Class"
            : item.type === "TEST"
              ? "Test"
              : "Exam",
        title: `${item.course.code.toUpperCase()} - ${item.course.name}`,
      };
    });
  }, [recentAttendance]);

  const filtered = useMemo(() => {
    return records
      .filter((r) => r.type === activeTab)
      .filter((r) => {
        if (!selectedDate) return true;
        const recordDate = new Date(r.date).toISOString().split("T")[0];
        return recordDate === selectedDate;
      });
  }, [records, activeTab, selectedDate]);

  const presentCount = filtered.filter((r) => r.status === "Present").length;

  if (loading)
    return <div className="text-white p-6">Loading attendance...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 min-h-screen text-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-400"
      >
        Attendance Dashboard
      </motion.h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-4">
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

      {/* Date Filter */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="text-sm text-red-400 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <StatCard title={`${activeTab} Records`} value={filtered.length} />
        <StatCard title="Present" value={presentCount} />
        <StatCard
          title="Attendance %"
          value={`${Math.round((presentCount / (filtered.length || 1)) * 100)}%`}
        />
      </motion.div>

      {/* Records */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 p-4 sm:p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-300">
          {activeTab} Attendance Records
        </h2>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-sm">No records found.</p>
          ) : (
            filtered.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-slate-900 border border-white/10 rounded hover:bg-slate-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
                  <p className="text-gray-200 font-medium">{record.title}</p>

                  <TypeBadge type={record.type} />
                </div>

                <div className="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {record.formattedDate}
                  </p>
                  <StatusBadge status={record.status} />
                </div>
              </motion.div>
            ))
          )}
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
      <div className="text-xl sm:text-2xl font-bold text-indigo-400">
        {value}
      </div>
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

/* Type Badge */
function TypeBadge({ type }: { type: AttendanceType }) {
  const styles = {
    Class: "bg-blue-500/10 text-blue-400",
    Test: "bg-purple-500/10 text-purple-400",
    Exam: "bg-pink-500/10 text-pink-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${styles[type]} mt-1 sm:mt-0`}
    >
      {type}
    </span>
  );
}
