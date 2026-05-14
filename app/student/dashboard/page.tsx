"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  FileText,
  ClipboardCheck,
  Download,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QRCode from "react-qr-code";

/* ---------------- MOCK DATA ---------------- */

type AttendanceType = "Class" | "Test" | "Exam";
type Status = "Present" | "Absent" | "Late";

interface Attendance {
  course: string;
  date: string;
  status: Status;
  type: AttendanceType;
}

const attendanceData: Attendance[] = [
  {
    course: "Web Development",
    date: "Feb 15, 2026",
    status: "Present",
    type: "Class",
  },
  {
    course: "Database Systems",
    date: "Feb 14, 2026",
    status: "Absent",
    type: "Test",
  },
  {
    course: "AI Fundamentals",
    date: "Feb 13, 2026",
    status: "Present",
    type: "Class",
  },
  {
    course: "Software Engineering",
    date: "Mar 01, 2026",
    status: "Present",
    type: "Exam",
  },
  { course: "Networking", date: "Mar 02, 2026", status: "Late", type: "Test" },
];

/* ---------------- COMPONENT ---------------- */

export default function StudentDashboard() {
  const [data] = useState(attendanceData);

  const stats = useMemo(() => {
    const total = data.length;

    const classes = data.filter((d) => d.type === "Class");
    const tests = data.filter((d) => d.type === "Test");
    const exams = data.filter((d) => d.type === "Exam");

    const present = data.filter((d) => d.status === "Present");

    return {
      total,
      classCount: classes.length,
      testCount: tests.length,
      examCount: exams.length,
      attendanceRate: Math.round((present.length / total) * 100),
    };
  }, [data]);

  /* QR handlers */
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
      link.download = "student-qr.png";
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
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-indigo-400 mb-6"
      >
        Student Dashboard
      </motion.h1>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <StatCard title="Total Records" value={stats.total} />
        <StatCard title="Classes Attendance" value={stats.classCount} />
        <StatCard title="Test Attendance" value={stats.testCount} />
        <StatCard title="Exam Attendance" value={stats.examCount} />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} />
      </motion.div>

      {/* RECENT ACTIVITY */}
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">
            Recent Attendance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-3 text-left">Course</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {data.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 text-gray-300">{item.course}</td>
                    <td className="text-gray-400">{item.date}</td>

                    <td>
                      <TypeBadge type={item.type} />
                    </td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* QR SECTION */}
      <Card className="bg-white/5 border border-white/10 mt-10">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Student Attendance QR Code
          </h2>

          <div id="student-qr" className="bg-white p-4 rounded-xl">
            <QRCode value="STUDENT_REG_123456" size={180} />
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={downloadQR} className="bg-indigo-600">
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

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardContent className="p-6">
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-indigo-400">{value}</h3>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    Present: "text-green-400",
    Absent: "text-red-400",
    Late: "text-yellow-400",
  };

  return <span className={styles[status]}>{status}</span>;
}

function TypeBadge({ type }: { type: AttendanceType }) {
  const styles = {
    Class: "text-blue-400",
    Test: "text-purple-400",
    Exam: "text-orange-400",
  };

  return <span className={styles[type]}>{type}</span>;
}
