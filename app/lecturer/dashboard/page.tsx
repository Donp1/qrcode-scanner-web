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
import { useLecturerAuth } from "@/hooks/useLecturerAuth";
import { truncateText } from "@/lib/utils";

export default function LecturerDashboard() {
  const { lecturer, stats, loading } = useLecturerAuth();

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <span className="text-lg font-medium animate-bounce">Loading...</span>
        </div>
      ) : (
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

              <h1 className="text-4xl font-bold mb-3">
                Welcome Back, {truncateText(lecturer?.name || "Lecturer", 20)}{" "}
                👋
              </h1>

              <p className="text-slate-400 max-w-3xl">
                Monitor attendance records, student participation, assigned
                courses, and class performance across all courses assigned to
                you.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10"
          >
            <StatCard
              title="Assigned Courses"
              value={stats ? stats.totalAssignedCourses.toString() || "0" : "0"}
              icon={<BookOpen className="text-indigo-400" />}
            />

            <StatCard
              title="Registered Students"
              value={
                stats ? stats.totalStudentsRegistered.toString() || "0" : "0"
              }
              icon={<Users className="text-blue-400" />}
            />

            <StatCard
              title="Average Attendance"
              value={stats ? `${stats.overallAverageAttendance}%` : "0%"}
              icon={<TrendingUp className="text-green-400" />}
            />

            {/* <StatCard
          title="Total Sessions"
          value={stats ? stats.totalSessions.toString() || "0" : "0"}
          icon={<Clock3 className="text-pink-400" />}
        /> */}
          </motion.div>

          {/* Assigned Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Assigned Courses
                </h2>

                <p className="text-slate-400 mt-1">
                  Overview of all lecturer course allocations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {stats?.courses.map((course, index) => (
                <motion.div
                  key={course.courseId}
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

                            <span className="text-indigo-400 font-semibold uppercase">
                              {course.courseCode}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold text-white capitalize">
                            {truncateText(course.courseTitle, 30)}
                          </h3>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                          <span className="text-green-400 font-semibold text-sm">
                            {course.averageAttendance}%
                          </span>
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                          <p className="text-slate-400 text-sm mb-1">
                            Students
                          </p>

                          <h4 className="text-2xl font-bold text-white">
                            {course.totalStudentsRegistered}
                          </h4>
                        </div>

                        <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4">
                          <p className="text-slate-400 text-sm mb-1">
                            Attendance Record
                          </p>

                          <h4 className="text-2xl font-bold text-white">
                            {course.totalAttendanceRecords}
                          </h4>
                        </div>
                      </div>

                      <Link
                        href={`/lecturer/dashboard/courses/${course.courseId}`}
                        className="w-full"
                      >
                        {/* <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      View Course Analytics
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button> */}
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
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
