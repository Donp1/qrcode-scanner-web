"use client";

import { motion } from "framer-motion";

import {
  Mail,
  CalendarDays,
  MapPin,
  UserCircle,
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  Clock3,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LecturerProfilePage() {
  const lecturer = {
    name: "Dr. Ada Chukwu",
    title: "Senior Lecturer",
    email: "ada.chukwu@university.edu",
    department: "Computer Science",
    office: "Block A, Room 204",
    phone: "+234 803 123 4567",
    assignedCourses: 4,
    totalStudents: 160,
    avgAttendance: "84%",
    officeHours: "Mon/Wed • 10:00 AM - 12:00 PM",
    specialization: "Artificial Intelligence & Software Engineering",
    joined: "August 2018",
    status: "Active",
  };

  const assignedCourses = [
    "CSC 301 — Data Structures & Algorithms",
    "CSC 305 — Database Systems",
    "CSC 401 — Artificial Intelligence",
    "CSC 402 — Software Engineering",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-indigo-400 font-medium mb-2">
          Lecturer Account
        </p>

        <h1 className="text-4xl font-bold mb-3">
          Profile Overview
        </h1>

        <p className="text-slate-400 max-w-2xl">
          View lecturer information, assigned courses, attendance
          statistics, and department details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 2xl:grid-cols-[380px_minmax(0,1fr)] gap-8">
        {/* Left Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-white/5 border border-white/10 overflow-hidden">
            {/* Top Banner */}
            <div className="h-28 bg-gradient-to-r from-indigo-600 to-purple-700" />

            <CardContent className="relative p-6">
              {/* Avatar */}
              <div className="-mt-16 mb-5">
                <div className="w-28 h-28 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-indigo-400" />
                </div>
              </div>

              {/* Lecturer Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-3xl font-bold text-white">
                    {lecturer.name}
                  </h2>

                  <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/10">
                    {lecturer.status}
                  </Badge>
                </div>

                <p className="text-indigo-400 font-medium mb-2">
                  {lecturer.title}
                </p>

                <p className="text-slate-400 leading-relaxed">
                  {lecturer.specialization}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <ProfileItem
                  icon={<Mail className="w-4 h-4 text-indigo-400" />}
                  label="Email"
                  value={lecturer.email}
                />

                <ProfileItem
                  icon={<Phone className="w-4 h-4 text-indigo-400" />}
                  label="Phone"
                  value={lecturer.phone}
                />

                <ProfileItem
                  icon={<MapPin className="w-4 h-4 text-indigo-400" />}
                  label="Office"
                  value={lecturer.office}
                />

                <ProfileItem
                  icon={
                    <CalendarDays className="w-4 h-4 text-indigo-400" />
                  }
                  label="Office Hours"
                  value={lecturer.officeHours}
                />

                <ProfileItem
                  icon={
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                  }
                  label="Department"
                  value={lecturer.department}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  Contact Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Section */}
        <div className="space-y-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <StatCard
              icon={<BookOpen className="text-indigo-400" />}
              title="Assigned Courses"
              value={lecturer.assignedCourses.toString()}
            />

            <StatCard
              icon={<Users className="text-blue-400" />}
              title="Students"
              value={lecturer.totalStudents.toString()}
            />

            <StatCard
              icon={<TrendingUp className="text-green-400" />}
              title="Avg Attendance"
              value={lecturer.avgAttendance}
            />

            <StatCard
              icon={<Clock3 className="text-yellow-400" />}
              title="Joined"
              value="2018"
            />
          </motion.div>

          {/* Assigned Courses */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 border border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl text-white">
                  Assigned Courses
                </CardTitle>

                <p className="text-slate-400 text-sm">
                  Courses currently managed by this lecturer.
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {assignedCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {course}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          Attendance monitoring enabled
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/10">
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lecturer Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0">
              <CardContent className="p-8">
                <p className="text-indigo-100 text-sm mb-3">
                  Lecturer Summary
                </p>

                <h2 className="text-3xl font-bold mb-4">
                  Academic Profile
                </h2>

                <p className="text-indigo-100 leading-relaxed max-w-3xl">
                  This lecturer account is configured to manage course
                  attendance, student participation tracking, and
                  academic monitoring for assigned courses only within
                  the Smart QR-Code Based Attendance Platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="mt-1">{icon}</div>

      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>

        <p className="text-white font-medium break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {icon}
        </div>

        <h3 className="text-3xl font-bold text-white mb-1">
          {value}
        </h3>

        <p className="text-sm text-slate-400">{title}</p>
      </CardContent>
    </Card>
  );
}