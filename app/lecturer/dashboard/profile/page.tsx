"use client";

import { motion } from "framer-motion";

import {
  Mail,
  CalendarDays,
  UserCircle,
  GraduationCap,
  BookOpen,
  Users,
  Clock3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLecturerAuth } from "@/hooks/useLecturerAuth";

export default function LecturerProfilePage() {
  const { lecturer, loading } = useLecturerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        <div className="animate-pulse text-indigo-300 text-lg">
          Loading lecturer profile...
        </div>
      </div>
    );
  }

  if (!lecturer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Lecturer not found
      </div>
    );
  }

  const assignedCourses = lecturer.assignedCourses || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-indigo-300 font-medium mb-2">Lecturer Profile</p>

        <h1 className="text-4xl font-bold mb-2 text-white">Profile Overview</h1>

        <p className="text-slate-400 max-w-2xl">
          View your personal information, assigned courses, and academic
          responsibilities.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 2xl:grid-cols-[380px_minmax(0,1fr)] gap-8">
        {/* LEFT PROFILE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                  <UserCircle className="w-14 h-14 text-indigo-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {lecturer.name}
                  </h2>

                  <p className="text-indigo-300 text-sm">
                    Lecturer • {lecturer.department}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-4">
                <ProfileItem
                  icon={<Mail className="w-4 h-4 text-indigo-400" />}
                  label="Email"
                  value={lecturer.email}
                />

                <ProfileItem
                  icon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
                  label="Faculty"
                  value={lecturer.faculty || "Not set"}
                />

                <ProfileItem
                  icon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
                  label="Department"
                  value={lecturer.department || "Not set"}
                />

                <ProfileItem
                  icon={<CalendarDays className="w-4 h-4 text-indigo-400" />}
                  label="Joined"
                  value={new Date(lecturer.createdAt).toDateString()}
                />
              </div>

              {/* BUTTONS */}
              {/* <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1">
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 flex-1"
                >
                  Settings
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard
              icon={<BookOpen className="text-indigo-400" />}
              title="Assigned Courses"
              value={assignedCourses.length}
            />

            <StatCard
              icon={<Users className="text-blue-400" />}
              title="Faculty"
              value={lecturer.faculty || "N/A"}
            />

            <StatCard
              icon={<Clock3 className="text-yellow-400" />}
              title="Department"
              value={lecturer.department || "N/A"}
            />
          </div>

          {/* ASSIGNED COURSES */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Assigned Courses
              </CardTitle>

              <p className="text-slate-400 text-sm">
                Courses you are currently handling
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {assignedCourses.length === 0 ? (
                <p className="text-slate-400">No assigned courses</p>
              ) : (
                assignedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex justify-between items-center p-4 bg-slate-900 border border-white/10 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {course.code.toUpperCase()} — {course.name}
                      </p>

                      <p className="text-slate-400 text-sm">
                        Level: {course.level || "N/A"}
                      </p>
                    </div>

                    <Badge className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Active
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* SUMMARY */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-3 text-white">
                Academic Profile
              </h2>

              <p className="text-indigo-100 leading-relaxed">
                This profile represents a lecturer account responsible for
                managing assigned courses, tracking student attendance, and
                overseeing academic activities within the system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

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
    <div className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-slate-900">
      <div className="mt-1">{icon}</div>

      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-white font-medium">{value}</p>
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
  value: any;
}) {
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardContent className="p-5">
        <div className="mb-3">{icon}</div>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-slate-400 text-sm">{title}</p>
      </CardContent>
    </Card>
  );
}
