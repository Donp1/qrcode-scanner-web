"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QRCode from "react-qr-code";
import { Download, Printer } from "lucide-react";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const downloadLink = document.createElement("a");
      downloadLink.download = "student-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    const printContent = document.getElementById("student-qr");
    if (!printContent) return;

    const printWindow = window.open("", "", "width=600,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Print QR Code</title>
      </head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
        ${printContent.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      {/* <div
        className={`fixed md:relative z-40 top-0 left-0 h-screen w-64 bg-slate-900 border-r border-white/10 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-8 text-indigo-400">
          Student Panel
        </h2>

        <nav className="space-y-4">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem icon={<BookOpen size={18} />} label="My Courses" />
          <SidebarItem icon={<CalendarCheck size={18} />} label="Attendance" />
          <SidebarItem icon={<User size={18} />} label="Profile" />
        </nav>

        <div className="absolute bottom-6 left-6">
          <Button variant="ghost" className="text-red-400 hover:text-red-500">
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Top Bar */}
        {/* <div className="flex justify-between items-center mb-8">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="bg-white/10 px-4 py-2 rounded-xl text-sm">
            Welcome, John 👋
          </div>
        </div> */}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <StatCard title="Enrolled Courses" value="6" />
          <StatCard title="Attendance Rate" value="92%" />
          <StatCard title="Classes Today" value="2" />
        </motion.div>

        {/* Attendance Table */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Recent Attendance
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="py-3">Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3">Web Development</td>
                    <td>Feb 15, 2026</td>
                    <td className="text-green-400">Present</td>
                  </tr>
                  <tr>
                    <td className="py-3">Database Systems</td>
                    <td>Feb 14, 2026</td>
                    <td className="text-red-400">Absent</td>
                  </tr>
                  <tr>
                    <td className="py-3">AI Fundamentals</td>
                    <td>Feb 13, 2026</td>
                    <td className="text-green-400">Present</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Qr-Code Section */}

        {/* QR Code Section */}
        <Card className="bg-white/5 border border-white/10 mt-10">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Your Attendance QR Code
            </h2>

            <div id="student-qr" className="bg-white p-4 rounded-xl">
              <QRCode value="STUDENT_REG_123456" size={180} />
            </div>

            <div className="flex gap-4 mt-6 flex-wrap justify-center">
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
    </div>
  );
}

/* ---------------- Components ---------------- */

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer transition">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
      <CardContent className="p-6">
        <p className="text-gray-400 text-sm mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}
