"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  BookOpen,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLecturerAuth } from "@/hooks/useLecturerAuth";
import { base_url } from "@/constants";

interface Student {
  id: string;
  name: string;
  regNumber: string;
  level: string;
  faculty?: string;
  department?: string;
  course: {
    id: string;
    code: string;
    name: string;
  };
}

export default function StudentsPage() {
  const { loading: authLoading } = useLecturerAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // input state (what user types)
  const [searchInput, setSearchInput] = useState("");

  // actual query state (what triggers API call)
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  // ---------------- FETCH STUDENTS ----------------
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${base_url}/lecturer/students?regNumber=${searchQuery}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (data.success) {
          setStudents(data.students);
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    if (!searchQuery) {
      fetchStudents(); // initial load
      return;
    }

    fetchStudents();
  }, [searchQuery]);

  // ---------------- COURSE OPTIONS ----------------
  const courseOptions = useMemo(() => {
    const unique = new Map();

    students.forEach((s) => {
      unique.set(s.course.id, `${s.course.code} - ${s.course.name}`);
    });

    return ["All Courses", ...Array.from(unique.values())];
  }, [students]);

  // ---------------- FILTER ----------------
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const courseLabel = `${student.course.code} - ${student.course.name}`;

      return selectedCourse === "All Courses" || selectedCourse === courseLabel;
    });
  }, [students, selectedCourse]);

  // ---------------- SEARCH HANDLERS ----------------
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ---------------- LOADING ----------------
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        <div className="animate-pulse text-indigo-300 text-lg">
          Loading students...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-2 text-white">Course Students</h1>

        <p className="text-slate-400 max-w-2xl">
          View all students registered under your assigned courses.
        </p>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <QuickStat
            icon={<Users />}
            title="Students"
            value={filteredStudents.length}
          />
          <QuickStat icon={<TrendingUp />} title="Attendance" value="0%" />
          <QuickStat icon={<AlertTriangle />} title="Probation" value={0} />
          <QuickStat
            icon={<UserCheck />}
            title="Active"
            value={filteredStudents.length}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 2xl:grid-cols-[320px_minmax(0,1fr)] gap-8">
        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* COURSE FILTER */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="text-indigo-300" />
                Course Filter
              </CardTitle>
            </CardHeader>

            <CardContent>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-slate-200"
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* SEARCH */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Search Students</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />

                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search reg number..."
                    className="pl-10 bg-slate-900 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN TABLE */}
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Student Roster</CardTitle>
            <p className="text-slate-400 text-sm">
              Showing {filteredStudents.length} students
            </p>
          </CardHeader>

          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center text-slate-400 py-10">
                No students found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-4 bg-slate-900 border border-white/10 rounded"
                  >
                    <div>
                      <p className="font-semibold text-white">{student.name}</p>
                      <p className="text-sm text-slate-400">
                        {student.regNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-indigo-300">
                        {student.course.code}
                      </p>
                      <p className="text-xs text-slate-500">
                        {student.level} Level
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* QUICK STAT */
function QuickStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
      <div className="text-indigo-300 mb-2">{icon}</div>
      <h2 className="text-xl font-bold text-white">{value}</h2>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}
