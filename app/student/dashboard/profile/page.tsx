"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  School,
  Hash,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function ProfilePage() {
  const { loading, student } = useStudentAuth();

  if (loading) {
    return (
      <div className="text-white p-6 min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium animate-bounce">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!student) {
    return <div className="text-red-400 p-6">No student data found</div>;
  }

  const courses = student.registeredCourses || [];

  const fullName = student.name;
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const lastAttendance = "N/A"; // replace if you later add API field

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-950 min-h-screen text-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        Student Profile
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT: Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 p-6 rounded-lg border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
              {initials}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-gray-400">{student.regNumber}</p>

              <span className="inline-flex items-center gap-1 mt-1 text-sm text-green-400">
                <CheckCircle2 size={16} />
                Active
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <ProfileItem
              icon={<Mail />}
              label="Reg Number"
              value={student.regNumber}
            />
            <ProfileItem icon={<User />} label="Level" value={student.level} />
            <ProfileItem
              icon={<School />}
              label="Faculty"
              value={student.faculty}
            />
            <ProfileItem
              icon={<School />}
              label="Department"
              value={student.department}
            />
            <ProfileItem
              icon={<Hash />}
              label="Student ID"
              value={student.id}
            />
            <ProfileItem
              icon={<CalendarCheck />}
              label="Last Attendance"
              value={lastAttendance}
            />
          </div>
        </motion.div>

        {/* RIGHT: Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-6 rounded-lg border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4 text-indigo-300">
            <BookOpen size={18} />
            <h3 className="font-semibold">Registered Courses</h3>
          </div>

          {courses.length === 0 ? (
            <p className="text-gray-400">No courses registered</p>
          ) : (
            <div className="space-y-3">
              {courses.map((course: any) => (
                <div
                  key={course.id}
                  className="bg-slate-900 border border-white/10 p-3 rounded"
                >
                  <p className="font-medium text-white">
                    {course.code.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">{course.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Level: {course.level}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* Reusable Components */
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
    <div className="flex items-center gap-3 bg-slate-900 border border-white/10 px-4 py-3 rounded">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}
