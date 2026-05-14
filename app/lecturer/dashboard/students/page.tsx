"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  name: string;
  matricNumber: string;
  level: string;
  course: string;
  attendanceRate: number;
  status: "Active" | "Inactive" | "On Probation";
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    matricNumber: "CSC/2020/001",
    level: "300",
    course: "Data Structures & Algorithms",
    attendanceRate: 92,
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    matricNumber: "CSC/2020/002",
    level: "300",
    course: "Database Systems",
    attendanceRate: 85,
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    matricNumber: "CSC/2020/003",
    level: "300",
    course: "Software Engineering",
    attendanceRate: 72,
    status: "On Probation",
  },
  {
    id: "4",
    name: "Alice Brown",
    matricNumber: "CSC/2020/004",
    level: "300",
    course: "Artificial Intelligence",
    attendanceRate: 98,
    status: "Active",
  },
  {
    id: "5",
    name: "Ezinne Okafor",
    matricNumber: "CSC/2020/005",
    level: "300",
    course: "Database Systems",
    attendanceRate: 65,
    status: "On Probation",
  },
];

const statusOptions: Array<Student["status"] | "All"> = [
  "All",
  "Active",
  "On Probation",
  "Inactive",
];

const courseOptions = [
  "All Courses",
  ...Array.from(new Set(mockStudents.map((student) => student.course))),
];

function StatusBadge({ status }: { status: Student["status"] }) {
  if (status === "Active") {
    return (
      <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/10">
        Active
      </Badge>
    );
  }

  if (status === "On Probation") {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/10">
        Probation
      </Badge>
    );
  }

  return (
    <Badge className="bg-slate-500/10 text-slate-300 border border-slate-500/20 hover:bg-slate-500/10">
      Inactive
    </Badge>
  );
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Student["status"]>(
    "All",
  );

  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesCourse =
        selectedCourse === "All Courses"
          ? true
          : student.course === selectedCourse;

      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.matricNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesCourse && matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, selectedCourse]);

  const averageAttendance =
    filteredStudents.length > 0
      ? Math.round(
          filteredStudents.reduce(
            (sum, student) => sum + student.attendanceRate,
            0,
          ) / filteredStudents.length,
        )
      : 0;

  const probationStudents = filteredStudents.filter(
    (student) => student.status === "On Probation",
  ).length;

  const activeStudents = filteredStudents.filter(
    (student) => student.status === "Active",
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col xl:flex-col xl:items-center xl:justify-between gap-6">
          <div>
            <p className="text-indigo-400 font-medium mb-2">
              Lecturer Student Management
            </p>

            <h1 className="text-4xl font-bold mb-3">Course Students</h1>

            <p className="text-slate-400 max-w-2xl">
              Monitor attendance records, manage student participation, and
              track performance for students enrolled in your assigned courses.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
            <QuickStat
              icon={<Users className="w-5 h-5 text-blue-400" />}
              title="Students"
              value={filteredStudents.length.toString()}
            />

            <QuickStat
              icon={<TrendingUp className="w-5 h-5 text-green-400" />}
              title="Attendance"
              value={`${averageAttendance}%`}
            />

            <QuickStat
              icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
              title="Probation"
              value={probationStudents.toString()}
            />

            <QuickStat
              icon={<UserCheck className="w-5 h-5 text-indigo-400" />}
              title="Active"
              value={activeStudents.toString()}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 2xl:grid-cols-[320px_minmax(0,1fr)] gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          {/* Course Filter */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Course Filter
              </CardTitle>
            </CardHeader>

            <CardContent>
              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Search Students</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or matric number..."
                  className="pl-11 bg-slate-900 border-white/10 text-white h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Filters */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Attendance Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={`w-full justify-start ${
                    statusFilter === status
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/5 border border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-white text-2xl">
                    Student Roster
                  </CardTitle>

                  <p className="text-slate-400 text-sm mt-1">
                    Showing {filteredStudents.length} students
                  </p>
                </div>

                <Button className="bg-indigo-600 hover:bg-indigo-700 w-fit">
                  Export Report
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  No students match your current filters.
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900/70 border-b border-white/10">
                        <tr className="text-left">
                          <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Student
                          </th>

                          <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Course
                          </th>

                          <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Level
                          </th>

                          <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Attendance
                          </th>

                          <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Status
                          </th>

                          {/* <th className="px-6 py-4 text-sm font-medium text-slate-400 text-right">
                            Action
                          </th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-white/5 hover:bg-white/[0.03] transition"
                          >
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-semibold text-white">
                                  {student.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                  {student.matricNumber}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {student.course}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {student.level} Level
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-full max-w-[120px] h-2 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      student.attendanceRate >= 80
                                        ? "bg-green-400"
                                        : student.attendanceRate >= 70
                                          ? "bg-yellow-400"
                                          : "bg-red-400"
                                    }`}
                                    style={{
                                      width: `${student.attendanceRate}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-white text-sm font-medium">
                                  {student.attendanceRate}%
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge status={student.status} />
                            </td>

                            {/* <td className="px-6 py-5 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                              >
                                View Details
                              </Button>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden p-4 space-y-4">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                      >
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              {student.name}
                            </h3>

                            <p className="text-slate-500 text-sm">
                              {student.matricNumber}
                            </p>
                          </div>

                          <StatusBadge status={student.status} />
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Course</span>

                            <span className="text-white text-right">
                              {student.course}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Level</span>

                            <span className="text-white">
                              {student.level} Level
                            </span>
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Attendance</span>

                              <span className="text-white font-medium">
                                {student.attendanceRate}%
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  student.attendanceRate >= 80
                                    ? "bg-green-400"
                                    : student.attendanceRate >= 70
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                }`}
                                style={{
                                  width: `${student.attendanceRate}%`,
                                }}
                              />
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-4 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function QuickStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-[120px]">
      <div className="flex items-center justify-between mb-3">{icon}</div>

      <h3 className="text-2xl font-bold text-white">{value}</h3>

      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}
