"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  CalendarCheck,
  TrendingUp,
  Clock3,
  ArrowRight,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
  totalSessions: number;
  avgAttendance: number;
  nextClass: string;
  level: string;
  semester: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    code: "CSC 301",
    name: "Data Structures & Algorithms",
    students: 45,
    totalSessions: 24,
    avgAttendance: 78,
    nextClass: "Tomorrow • 10:00 AM",
    level: "300 Level",
    semester: "First Semester",
  },
  {
    id: "2",
    code: "CSC 305",
    name: "Database Systems",
    students: 38,
    totalSessions: 20,
    avgAttendance: 82,
    nextClass: "Friday • 1:00 PM",
    level: "300 Level",
    semester: "First Semester",
  },
  {
    id: "3",
    code: "CSC 302",
    name: "Software Engineering",
    students: 42,
    totalSessions: 18,
    avgAttendance: 75,
    nextClass: "Today • 2:00 PM",
    level: "300 Level",
    semester: "Second Semester",
  },
  {
    id: "4",
    code: "CSC 401",
    name: "Artificial Intelligence",
    students: 35,
    totalSessions: 16,
    avgAttendance: 85,
    nextClass: "Monday • 9:00 AM",
    level: "400 Level",
    semester: "Second Semester",
  },
];

export default function LecturerCourses() {
  const router = useRouter();

  const handleViewDetails = (course: Course) => {
    router.push(`/lecturer/dashboard/courses/${course.id}`);
  };

  const handleTakeAttendance = (course: Course) => {
    router.push(`/lecturer/dashboard/attendance?course=${course.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10"
      >
        <div>
          <p className="text-indigo-400 font-medium mb-2">
            Lecturer Course Management
          </p>

          <h1 className="text-4xl font-bold mb-3">My Assigned Courses</h1>

          <p className="text-slate-400 max-w-2xl">
            Access attendance statistics, manage class sessions, and monitor
            student participation only for the courses assigned to you.
          </p>
        </div>

        <div className="relative w-full lg:w-[320px]">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search course code or title..."
            className="pl-10 bg-slate-900 border-slate-700 text-white h-12"
          />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
      >
        <SummaryCard
          title="Assigned Courses"
          value={mockCourses.length.toString()}
          icon={<BookOpen className="text-indigo-400" />}
        />

        <SummaryCard
          title="Registered Students"
          value={mockCourses
            .reduce((sum, course) => sum + course.students, 0)
            .toString()}
          icon={<Users className="text-blue-400" />}
        />

        <SummaryCard
          title="Total Sessions"
          value={mockCourses
            .reduce((sum, course) => sum + course.totalSessions, 0)
            .toString()}
          icon={<CalendarCheck className="text-green-400" />}
        />

        <SummaryCard
          title="Average Attendance"
          value={`${Math.round(
            mockCourses.reduce((sum, course) => sum + course.avgAttendance, 0) /
              mockCourses.length,
          )}%`}
          icon={<TrendingUp className="text-purple-400" />}
        />
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>

                      <span className="text-indigo-400 font-semibold">
                        {course.code}
                      </span>
                    </div>

                    <CardTitle className="text-2xl text-white leading-snug">
                      {course.name}
                    </CardTitle>

                    <div className="flex gap-3 mt-3 flex-wrap">
                      <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300">
                        {course.level}
                      </span>

                      <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300">
                        {course.semester}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                      course.avgAttendance >= 80
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {course.avgAttendance}%
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Students</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      {course.students}
                    </h3>
                  </div>

                  <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <CalendarCheck className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Sessions</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      {course.totalSessions}
                    </h3>
                  </div>
                </div>

                {/* Next Class */}
                <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 mb-6">
                  <div className="bg-indigo-500/10 p-2 rounded-xl">
                    <Clock3 className="w-5 h-5 text-indigo-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Next Class</p>

                    <h4 className="font-semibold text-white">
                      {course.nextClass}
                    </h4>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    onClick={() => handleViewDetails(course)}
                  >
                    View Analytics
                  </Button>

                  {/* <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleTakeAttendance(course)}
                  >
                    Take Attendance
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400 text-sm">{title}</p>

          <div>{icon}</div>
        </div>

        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}
