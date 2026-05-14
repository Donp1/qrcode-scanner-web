"use client";

import { motion } from "framer-motion";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock3,
  UserCheck,
  UserX,
  AlertTriangle,
  GraduationCap,
  BarChart3,
  Download,
  Camera,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
  totalSessions: number;
  avgAttendance: number;
  lastSession: string;
  description: string;
  department: string;
  level: string;
  nextClass: string;
  completionRate: number;
}

interface AttendanceSession {
  id: string;
  date: string;
  topic: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface Student {
  id: string;
  name: string;
  matricNumber: string;
  attendanceRate: number;
  totalPresent: number;
  totalSessions: number;
}

const mockCourse: Course = {
  id: "1",
  code: "CSC 301",
  name: "Data Structures & Algorithms",
  students: 45,
  totalSessions: 24,
  avgAttendance: 78,
  lastSession: "May 05, 2026",
  description:
    "Advanced course covering trees, graphs, sorting algorithms, searching techniques, recursion, dynamic programming, and algorithm optimization.",
  department: "Computer Science",
  level: "300",
  nextClass: "Tomorrow • 10:00 AM",
  completionRate: 72,
};

const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: "1",
    date: "May 06, 2026",
    topic: "Binary Trees",
    present: 35,
    absent: 10,
    late: 2,
    total: 45,
  },
  {
    id: "2",
    date: "May 05, 2026",
    topic: "Graph Traversal",
    present: 38,
    absent: 7,
    late: 1,
    total: 45,
  },
  {
    id: "3",
    date: "May 04, 2026",
    topic: "Sorting Algorithms",
    present: 32,
    absent: 13,
    late: 3,
    total: 45,
  },
  {
    id: "4",
    date: "May 01, 2026",
    topic: "Recursion",
    present: 40,
    absent: 5,
    late: 0,
    total: 45,
  },
];

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    matricNumber: "CSC/2020/001",
    attendanceRate: 85,
    totalPresent: 20,
    totalSessions: 24,
  },
  {
    id: "2",
    name: "Jane Smith",
    matricNumber: "CSC/2020/002",
    attendanceRate: 92,
    totalPresent: 22,
    totalSessions: 24,
  },
  {
    id: "3",
    name: "Bob Johnson",
    matricNumber: "CSC/2020/003",
    attendanceRate: 75,
    totalPresent: 18,
    totalSessions: 24,
  },
  {
    id: "4",
    name: "Alice Brown",
    matricNumber: "CSC/2020/004",
    attendanceRate: 88,
    totalPresent: 21,
    totalSessions: 24,
  },
  {
    id: "5",
    name: "Charlie Wilson",
    matricNumber: "CSC/2020/005",
    attendanceRate: 65,
    totalPresent: 16,
    totalSessions: 24,
  },
];

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id as string;

  const course = mockCourse;

  const excellentStudents = mockStudents.filter(
    (student) => student.attendanceRate >= 85,
  ).length;

  const lowAttendanceStudents = mockStudents.filter(
    (student) => student.attendanceRate < 70,
  ).length;

  const getAttendanceColor = (rate: number) => {
    if (rate >= 85) return "text-green-400";
    if (rate >= 70) return "text-yellow-400";

    return "text-red-400";
  };

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 85)
      return (
        <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">
          Excellent
        </Badge>
      );

    if (rate >= 70)
      return (
        <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          Average
        </Badge>
      );

    return (
      <Badge className="bg-red-500/10 text-red-400 border border-red-500/20">
        Low
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <Button
          variant="ghost"
          className="mb-6 text-slate-400 hover:text-white hover:bg-white/5"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl">
                <BookOpen className="w-7 h-7 text-indigo-400" />
              </div>

              <div>
                <p className="text-indigo-400 font-semibold text-sm">
                  {course.department}
                </p>

                <h1 className="text-4xl font-bold">{course.code}</h1>
              </div>
            </div>

            <h2 className="text-2xl text-slate-200 font-semibold mb-3">
              {course.name}
            </h2>

            <p className="text-slate-400 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Badge className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                Level {course.level}
              </Badge>

              <Badge className="bg-slate-800 text-slate-300 border border-white/10">
                {course.students} Students
              </Badge>

              <Badge className="bg-green-500/10 border border-green-500/20 text-green-400">
                {course.avgAttendance}% Attendance
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10"
      >
        <StatCard
          title="Enrolled Students"
          value={course.students.toString()}
          icon={<Users className="text-blue-400" />}
        />

        <StatCard
          title="Attendance Rate"
          value={`${course.avgAttendance}%`}
          icon={<TrendingUp className="text-green-400" />}
        />

        <StatCard
          title="Total Sessions"
          value={course.totalSessions.toString()}
          icon={<Calendar className="text-indigo-400" />}
        />

        <StatCard
          title="Excellent Students"
          value={excellentStudents.toString()}
          icon={<CheckCircle2 className="text-emerald-400" />}
        />

        <StatCard
          title="Low Attendance"
          value={lowAttendanceStudents.toString()}
          icon={<AlertTriangle className="text-red-400" />}
        />
      </motion.div>

      {/* Course Overview + Quick Analytics */}
      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_380px] gap-8 mb-10">
        {/* Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/5 border border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-indigo-400" />

                  <div>
                    <h3 className="text-2xl font-bold text-gray-100">
                      Recent Sessions
                    </h3>

                    <p className="text-slate-400 mt-1">
                      Latest attendance activity and class engagement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-4">
                {mockAttendanceSessions.map((session) => {
                  const percentage = Math.round(
                    (session.present / session.total) * 100,
                  );

                  return (
                    <div
                      key={session.id}
                      className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-lg text-white">
                            {session.topic}
                          </h4>

                          <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                            <Clock3 className="w-4 h-4" />
                            {session.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl">
                            <span className="text-indigo-400 font-semibold">
                              {percentage}% Attendance
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-5">
                        <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="w-4 h-4 text-green-400" />

                            <p className="text-sm text-slate-400">Present</p>
                          </div>

                          <h4 className="text-2xl font-bold text-green-400">
                            {session.present}
                          </h4>
                        </div>

                        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <UserX className="w-4 h-4 text-red-400" />

                            <p className="text-sm text-slate-400">Absent</p>
                          </div>

                          <h4 className="text-2xl font-bold text-red-400">
                            {session.absent}
                          </h4>
                        </div>

                        <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock3 className="w-4 h-4 text-yellow-400" />

                            <p className="text-sm text-slate-400">Late</p>
                          </div>

                          <h4 className="text-2xl font-bold text-yellow-400">
                            {session.late}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Insights */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <BarChart3 className="w-6 h-6 text-white" />

                  <h3 className="text-xl font-bold">Course Analytics</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-indigo-100 text-sm mb-2">
                      Course Completion
                    </p>

                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full"
                        style={{
                          width: `${course.completionRate}%`,
                        }}
                      />
                    </div>

                    <p className="text-sm text-indigo-100 mt-2">
                      {course.completionRate}% syllabus completed
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-indigo-100">Next Class</p>

                    <h4 className="text-xl font-bold mt-1">
                      {course.nextClass}
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-indigo-100">Last Session</p>

                    <h4 className="text-xl font-bold mt-1">
                      {course.lastSession}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />

                  <div>
                    <h3 className="text-xl font-bold">Student Performance</h3>

                    <p className="text-slate-400 text-sm">
                      Attendance ranking overview
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div
                      key={student.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-white">
                            {student.name}
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            {student.matricNumber}
                          </p>
                        </div>

                        {getAttendanceBadge(student.attendanceRate)}
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">
                            Attendance Rate
                          </span>

                          <span
                            className={`font-semibold ${getAttendanceColor(
                              student.attendanceRate,
                            )}`}
                          >
                            {student.attendanceRate}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendanceRate >= 85
                                ? "bg-green-500"
                                : student.attendanceRate >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${student.attendanceRate}%`,
                            }}
                          />
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
                          {student.totalPresent}/{student.totalSessions}{" "}
                          sessions attended
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
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
    <Card className="bg-white/5 border border-white/10">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">{title}</p>

          {icon}
        </div>

        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}
