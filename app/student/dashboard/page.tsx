"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Download,
  Printer,
  User2,
} from "lucide-react";

import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function StudentDashboard() {
  const { student, stats, recentAttendance, loading } = useStudentAuth();

  const attendanceRate = useMemo(() => {
    return stats?.overallAttendancePercentage || 0;
  }, [stats]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  /* ---------------- QR HANDLERS ---------------- */

  const downloadQR = () => {
    const svg = document.querySelector("#student-qr svg");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;

      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");

      link.download = `${student?.regNumber}-qr.png`;

      link.href = pngFile;

      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    const printContent = document.getElementById("student-qr");

    if (!printContent) return;

    const win = window.open("", "", "width=600,height=600");

    if (!win) return;

    win.document.write(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#fff;">
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    win.document.close();

    win.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-indigo-400">
            Student Dashboard
          </h1>

          <p className="text-gray-400 mt-2">Welcome back, {student?.name}</p>
        </div>

        {/* STUDENT INFO */}
        <Card className="bg-white/5 border border-white/10 w-full lg:w-[420px]">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-full">
                <User2 className="text-indigo-400" />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-gray-100">
                  {student?.name}
                </h2>

                <p className="text-sm text-gray-400">{student?.regNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
              <div>
                <p className="text-gray-500">Faculty</p>

                <p className="text-gray-200">{student?.faculty || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-500">Department</p>

                <p className="text-gray-200">{student?.department || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-500">Level</p>

                <p className="text-gray-200">{student?.level || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-500">Courses</p>

                <p className="text-gray-200">
                  {stats?.totalRegisteredCourses || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10"
      >
        <StatCard
          title="Registered Courses"
          value={stats?.totalRegisteredCourses || 0}
          icon={<BookOpen size={18} />}
        />

        <StatCard
          title="Attendance Records"
          value={stats?.totalAttendanceRecords || 0}
          icon={<CalendarCheck size={18} />}
        />

        <StatCard
          title="Present"
          value={stats?.totalPresentAttendance || 0}
          icon={<CheckCircle2 size={18} />}
        />

        <StatCard
          title="Absent"
          value={stats?.totalAbsentAttendance || 0}
          icon={<XCircle size={18} />}
        />

        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<TrendingUp size={18} />}
        />
      </motion.div>

      {/* COURSE PERFORMANCE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        {/* BEST COURSE */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-green-400 mb-4">
              Best Attended Course
            </h2>

            {stats?.bestAttendedCourse ? (
              <div>
                <p className="text-xl font-bold text-gray-200 uppercase">
                  {stats.bestAttendedCourse.courseCode}
                </p>

                <p className="text-gray-400 capitalize">
                  {stats.bestAttendedCourse.courseTitle}
                </p>

                <p className="text-3xl font-bold text-green-400 mt-4">
                  {stats.bestAttendedCourse.attendancePercentage}%
                </p>
              </div>
            ) : (
              <p className="text-gray-400">No attendance data available</p>
            )}
          </CardContent>
        </Card>

        {/* LOWEST COURSE */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-4">
              Lowest Attendance
            </h2>

            {stats?.lowestAttendedCourse ? (
              <div>
                <p className="text-xl font-bold text-gray-200 uppercase">
                  {stats.lowestAttendedCourse.courseCode}
                </p>

                <p className="text-gray-400 capitalize">
                  {stats.lowestAttendedCourse.courseTitle}
                </p>

                <p className="text-3xl font-bold text-red-400 mt-4">
                  {stats.lowestAttendedCourse.attendancePercentage}%
                </p>
              </div>
            ) : (
              <p className="text-gray-400">No attendance data available</p>
            )}
          </CardContent>
        </Card>

        {/* WARNINGS */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-yellow-400" />

              <h2 className="text-lg font-semibold text-yellow-400">
                Attendance Warnings
              </h2>
            </div>

            {stats?.warningCourses?.length ? (
              <div className="space-y-3">
                {stats.warningCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="border border-yellow-500/20 bg-yellow-500/10 rounded-lg p-3"
                  >
                    <p className="font-medium uppercase">{course.courseCode}</p>

                    <p className="text-sm text-gray-400 capitalize">
                      {course.courseTitle}
                    </p>

                    <p className="text-yellow-400 font-bold mt-1">
                      {course.attendancePercentage}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-400">No attendance warnings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT ATTENDANCE */}
      <Card className="bg-white/5 border border-white/10 mb-10">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6 text-indigo-300">
            Recent Attendance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-3 text-left">Course</th>

                  <th className="text-left">Type</th>

                  <th className="text-left">Status</th>

                  <th className="text-left">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {recentAttendance.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-200 uppercase">
                          {item.course.code}
                        </p>

                        <p className="text-xs text-gray-500 capitalize">
                          {item.course.name}
                        </p>
                      </div>
                    </td>

                    <td className="text-gray-300">{item.type}</td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* COURSE STATS */}
      <Card className="bg-white/5 border border-white/10 mb-10">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6 text-indigo-300">
            Course Attendance Performance
          </h2>

          <div className="space-y-5">
            {stats?.courses?.map((course) => (
              <div key={course.courseId}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-200 uppercase">
                      {course.courseCode}
                    </p>

                    <p className="text-sm text-gray-400 capitalize">
                      {course.courseTitle}
                    </p>
                  </div>

                  <p className="font-bold text-indigo-400">
                    {course.attendancePercentage}%
                  </p>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${course.attendancePercentage}%`,
                    }}
                  />
                </div>

                <div className="flex gap-5 mt-2 text-xs text-gray-400">
                  <span>Present: {course.presentAttendance}</span>

                  <span>Absent: {course.absentAttendance}</span>

                  <span>Total: {course.totalAttendanceRecords}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR SECTION */}
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            Student QR Code
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Use this QR code for attendance verification
          </p>

          <div id="student-qr" className="bg-white p-5 rounded-2xl">
            <QRCode
              value={JSON.stringify({
                studentId: student?.id,
              })}
              size={180}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              onClick={downloadQR}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Download size={16} className="mr-2" />
              Download
            </Button>

            <Button variant="outline" onClick={printQR}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
            {icon}
          </div>
        </div>

        <p className="text-gray-400 text-sm">{title}</p>

        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: "PRESENT" | "ABSENT" }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "PRESENT"
          ? "bg-green-500/10 text-green-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {status}
    </span>
  );
}
