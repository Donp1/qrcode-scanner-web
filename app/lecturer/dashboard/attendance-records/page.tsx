"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLecturerAuth } from "@/hooks/useLecturerAuth";
import { base_url } from "@/constants";
import toast from "react-hot-toast";

type AttendanceType = "Class" | "Test" | "Exam";
type AttendanceStatus = "Present" | "Absent";

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  type: AttendanceType;
  student: {
    name: string;
    regNumber: string;
  };
  course: {
    id: string;
    code: string;
    name: string;
  };
}

const tabs: AttendanceType[] = ["Class", "Test", "Exam"];

export default function LecturerAttendancePage() {
  const { loading: lecturerAuthLoading, lecturer } = useLecturerAuth();

  // Filters
  const [searchReg, setSearchReg] = useState("");
  const [activeTab, setActiveTab] = useState<AttendanceType>("Class");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Data
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    presentCount: 0,
    attendancePercentage: 0,
  });

  // optional for tables

  // =============================
  // FETCH DEFAULT ATTENDANCE ON LOAD
  // =============================
  useEffect(() => {
    const fetchDefaultAttendance = async () => {
      try {
        setAttendanceLoading(true);

        const res = await fetch(`${base_url}/lecturer/attendance`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!data.success) {
          toast.error("Failed to fetch attendance: " + data.error);
          return;
        }

        setRecords(data.records || []);
        setStats(
          data.stats || {
            totalRecords: 0,
            presentCount: 0,
            attendancePercentage: 0,
          },
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch attendance: " + (err as any).message);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchDefaultAttendance();
  }, []);

  // =============================
  // FETCH ATTENDANCE WITH FILTERS
  // =============================
  const handleSearch = async () => {
    try {
      setAttendanceLoading(true);
      const params = new URLSearchParams();

      if (searchReg) params.append("regNumber", searchReg);
      if (selectedDate) params.append("date", selectedDate);
      if (activeTab) params.append("type", activeTab.toUpperCase());
      if (selectedCourse) params.append("courseId", selectedCourse);

      const res = await fetch(
        `${base_url}/lecturer/attendance?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to fetch attendance: " + data.error);
        return;
      }

      setRecords(data.records || []);
      setStats(
        data.stats || {
          totalRecords: 0,
          presentCount: 0,
          attendancePercentage: 0,
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch attendance: " + (err as any).message);
    } finally {
      setAttendanceLoading(false);
    }
  };

  if (lecturerAuthLoading || attendanceLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-950 min-h-screen text-white">
      <motion.h1 className="text-2xl font-bold text-indigo-400 mb-6">
        Lecturer Attendance Dashboard
      </motion.h1>

      {/* FILTERS + SEARCH */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Reg Number..."
          value={searchReg}
          onChange={(e) => setSearchReg(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10"
        />
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10"
        >
          <option value="">All Courses</option>
          {lecturer?.assignedCourses?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.code.toUpperCase()} - {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10"
        />
        <button
          onClick={handleSearch}
          disabled={attendanceLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50"
        >
          {attendanceLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-indigo-600 border-indigo-500"
                : "bg-white/5 border-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Records" value={stats.totalRecords} />
        <StatCard title="Present" value={stats.presentCount} />
        <StatCard
          title="Attendance %"
          value={`${stats.attendancePercentage}%`}
        />
      </div>

      {/* RECORDS */}
      <div className="bg-white/5 border border-white/10 rounded p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-indigo-300 text-lg sm:text-xl font-semibold">
            Attendance Records
          </h2>
          {/* You can put search/filter buttons here if needed */}
        </div>

        <div className="space-y-3">
          {records.length === 0 ? (
            <p className="text-gray-400 text-sm">No records found</p>
          ) : (
            records.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-900 p-3 rounded border border-white/10 space-y-2 sm:space-y-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 w-full sm:w-auto">
                  <p className="font-medium text-sm sm:text-base">
                    {r.student.name} ({r.student.regNumber})
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-5 items-center text-xs sm:text-sm text-gray-400">
                    <p>
                      {r.course.code.toUpperCase()} - {r.course.name}
                    </p>
                    <TypeBadge type={String(r.type).toLowerCase()} />
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <p className="text-xs text-gray-500">
                    {new Date(r.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================= */
function StatCard({ title, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl text-indigo-400 font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    PRESENT: "text-green-400 bg-green-500/10",
    ABSENT: "text-red-400 bg-red-500/10",
  };

  return (
    <span className={`px-3 py-1 rounded text-sm ${map[status]}`}>{status}</span>
  );
}

// function TypeBadge({ type }: { type: string }) {
//   const colors = {
//     class: "bg-gradient-to-r from-blue-500 to-blue-700 text-white",
//     test: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black",
//     exam: "bg-gradient-to-r from-red-500 to-red-700 text-white",
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-sm font-semibold uppercase shadow-md ${colors[type.toLowerCase()]} drop-shadow-md`}
//     >
//       {type}
//     </span>
//   );
// }

function TypeBadge({ type }: { type: string }) {
  const colors: Record<"class" | "test" | "exam", string> = {
    class: "bg-gradient-to-r from-blue-500 to-blue-700 text-white",
    test: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black",
    exam: "bg-gradient-to-r from-red-500 to-red-700 text-white",
  };

  const key = type.toLowerCase() as "class" | "test" | "exam";

  return (
    <span
      className={`px-3 py-0.5 rounded-full text-sm font-semibold uppercase shadow ${colors[key]}`}
    >
      {type}
    </span>
  );
}
