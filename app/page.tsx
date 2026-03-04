"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.15),transparent_40%)]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <QrCode className="w-6 h-6" />
          SmartAttend
        </div>
        <div className="hidden md:flex gap-6 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-16 pt-12 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Smart QR-Based <span className="text-blue-500">Attendance</span> &
            Authentication
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed">
            A modern cloud-powered platform for secure student verification,
            real-time attendance tracking, and powerful analytics dashboards for
            institutions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/student" className="cursor-pointer">
              <Button className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl cursor-pointer">
                Login as Student
              </Button>
            </Link>
            <Link href="/lecturer">
              <Button
                variant="outline"
                className="w-full bg-black sm:w-auto px-8 py-6 text-lg rounded-2xl border-slate-600 text-white cursor-pointer"
              >
                Login as Lecturer
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Animated Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">
                    Secure Student Verification
                  </h3>
                  <p className="text-slate-400 text-sm ">
                    Unique QR for every student
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">
                    Cloud Security
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Real-time database storage
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <BarChart3 className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">
                    Analytics Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Monitor attendance trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-16 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Choose SmartAttend?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <QrCode className="w-8 h-8" />,
              title: "Instant QR Scanning",
              desc: "Fast and accurate attendance marking within seconds.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8" />,
              title: "Secure Authentication",
              desc: "Prevent impersonation with unique encrypted QR codes.",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Real-Time Reports",
              desc: "View attendance data instantly from anywhere.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/60 border h- border-slate-700 rounded-2xl hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="text-blue-500">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-16 py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} SmartAttend. All rights reserved.
      </footer>
    </div>
  );
}
