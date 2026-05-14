"use client";

import { motion } from "framer-motion";

import {
  Users,
  CalendarCheck,
  Clock3,
  TrendingUp,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LecturerDashboard() {
  // Lecturer assigned courses
  const assignedCourses = [
    {
      id: "1",
      code: "CSC 301",
      title: "Data Structures & Algorithms",
      students: 45,
      attendanceRate: 82,
      sessions: 24,
      nextClass: "Today • 10:00 AM",
    },
    {
      id: "2",
      code: "CSC 305",
      title: "Database Systems",
      students: 38,
      attendanceRate: 86,
      sessions: 20,
      nextClass: "Tomorrow • 1:00 PM",
    },
    {
      id: "3",
      code: "CSC 401",
      title: "Artificial Intelligence",
      students: 35,
      attendanceRate: 91,
      sessions: 16,
      nextClass: "Friday • 9:00 AM",
    },
  ];

  const recentAttendance = [
    {
      course: "CSC 301",
      date: "May 10, 2026",
      present: 40,
      absent: 5,
    },
    {
      course: "CSC 305",
      date: "May 8, 2026",
      present: 34,
      absent: 4,
    },
    {
      course: "CSC 401",
      date: "May 5, 2026",
      present: 33,
      absent: 2,
    },
  ];

  const topStudents = [
    {
      name: "Precious Joseph",
      matric: "U22CS1012",
      course: "CSC 301",
      attendance: "98%",
    },
    {
      name: "Sarah Michael",
      matric: "U22CS1044",
      course: "CSC 305",
      attendance: "96%",
    },
    {
      name: "Daniel Peter",
      matric: "U22CS1088",
      course: "CSC 401",
      attendance: "95%",
    },
  ];

  const totalStudents = assignedCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );

  const totalSessions = assignedCourses.reduce(
    (sum, course) => sum + course.sessions,
    0,
  );

  const averageAttendance = Math.round(
    assignedCourses.reduce((sum, course) => sum + course.attendanceRate, 0) /
      assignedCourses.length,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10"
      >
        <div>
          <p className="text-indigo-400 text-sm font-medium mb-2">
            Lecturer Dashboard
          </p>

          <h1 className="text-4xl font-bold mb-3">Welcome Back, Dr. Ada 👋</h1>

          <p className="text-slate-400 max-w-3xl">
            Monitor attendance records, student participation, assigned courses,
            and class performance across all courses assigned to you.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
      >
        <StatCard
          title="Assigned Courses"
          value={assignedCourses.length.toString()}
          icon={<BookOpen className="text-indigo-400" />}
        />

        <StatCard
          title="Registered Students"
          value={totalStudents.toString()}
          icon={<Users className="text-blue-400" />}
        />

        <StatCard
          title="Average Attendance"
          value={`${averageAttendance}%`}
          icon={<TrendingUp className="text-green-400" />}
        />

        <StatCard
          title="Total Sessions"
          value={totalSessions.toString()}
          icon={<Clock3 className="text-pink-400" />}
        />
      </motion.div>

      {/* Assigned Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Assigned Courses</h2>

            <p className="text-slate-400 mt-1">
              Overview of all lecturer course allocations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {assignedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl">
                          <BookOpen className="w-5 h-5 text-indigo-400" />
                        </div>

                        <span className="text-indigo-400 font-semibold">
                          {course.code}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white">
                        {course.title}
                      </h3>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                      <span className="text-green-400 font-semibold text-sm">
                        {course.attendanceRate}%
                      </span>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                      <p className="text-slate-400 text-sm mb-1">Students</p>

                      <h4 className="text-2xl font-bold text-white">
                        {course.students}
                      </h4>
                    </div>

                    <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                      <p className="text-slate-400 text-sm mb-1">Sessions</p>

                      <h4 className="text-2xl font-bold text-white">
                        {course.sessions}
                      </h4>
                    </div>
                  </div>

                  {/* Next Class */}
                  {/* <div className="flex items-center gap-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-4 mb-6">
                    <div className="bg-indigo-500/10 p-2 rounded-xl">
                      <Clock3 className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Next Class
                      </p>

                      <h4 className="font-semibold text-white">
                        {course.nextClass}
                      </h4>
                    </div>
                  </div> */}

                  <Link
                    href={`/lecturer/dashboard/courses/${course.id}`}
                    className="w-full"
                  >
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      View Course Analytics
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Attendance */}
      <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Attendance Table */}
        <Card className="bg-white/5 border border-white/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                Recent Attendance Sessions
              </h2>

              <p className="text-slate-400 mt-1">
                Attendance activity across all assigned courses.
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/70 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Course
                    </th>

                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Present
                    </th>

                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Absent
                    </th>

                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentAttendance.map((item, index) => {
                    const percentage = Math.round(
                      (item.present / (item.present + item.absent)) * 100,
                    );

                    return (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <td className="px-6 py-5 font-semibold text-white">
                          {item.course}
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {item.date}
                        </td>

                        <td className="px-6 py-5 text-green-400 font-medium">
                          {item.present}
                        </td>

                        <td className="px-6 py-5 text-red-400 font-medium">
                          {item.absent}
                        </td>

                        <td className="px-6 py-5">
                          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {recentAttendance.map((item, index) => {
                const percentage = Math.round(
                  (item.present / (item.present + item.absent)) * 100,
                );

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">
                        {item.course}
                      </h3>

                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {percentage}%
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date</span>

                        <span className="text-white">{item.date}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Present</span>

                        <span className="text-green-400 font-medium">
                          {item.present}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Absent</span>

                        <span className="text-red-400 font-medium">
                          {item.absent}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Top Performing Students
              </h2>

              <p className="text-slate-400 mt-1">
                Students with the best attendance records.
              </p>
            </div>

            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-full w-12 h-12 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {student.name}
                      </h3>

                      <p className="text-sm text-slate-500">{student.matric}</p>

                      <p className="text-sm text-indigo-400 mt-1">
                        {student.course}
                      </p>
                    </div>
                  </div>

                  <div className="text-green-400 font-bold text-lg">
                    {student.attendance}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
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
