"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  ArrowRight,
  Building2,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { base_url, levels } from "@/constants";
import toast from "react-hot-toast";
import { useCourses } from "@/hooks/useCourses";

export default function StudentAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const router = useRouter();

  const { loading, faculties, departments } = useCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isRegister) {
      // TODO: Connect to backend API
      console.log({ regNumber, password, name, faculty, department, level });

      const res = await fetch(`${base_url}/auth/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regNumber,
          password,
          name,
          faculty,
          department,
          level,
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        toast.error(data?.error || "Failed to register student");
        setIsSubmitting(false);
        return;
      }

      toast.success("Student registered successfully");
      localStorage.setItem("token", data.token);
      setIsSubmitting(false);
      // Temporary redirect
      router.push("/student/dashboard");
    } else {
      // TODO: Connect to backend API
      console.log({ regNumber, password });

      const res = await fetch(`${base_url}/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regNumber,
          password,
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        toast.error(data?.error || "Failed to login student");
        setIsSubmitting(false);
        return;
      }

      toast.success("Student logged in successfully");
      localStorage.setItem("token", data.token);
      setIsSubmitting(false);
      // Temporary redirect
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-6">
              <GraduationCap className="w-10 h-10 text-blue-500 mb-2" />
              <h2 className="text-2xl font-bold text-white">
                {isRegister ? "Student Registration" : "Student Login"}
              </h2>
              <p className="text-slate-400 text-sm mt-1 text-center">
                {isRegister
                  ? "Create your student account to access attendance dashboard"
                  : "Login with your registration number and password"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  {/* Faculty Dropdown */}

                  <div className="space-y-2">
                    <Label className="text-slate-300">Faculty</Label>

                    <div className="relative flex items-center">
                      <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 z-10" />

                      <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="w-full h-12 rounded-md border border-white/10 bg-white/5 text-white pl-11 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="" className="bg-slate-900">
                          Select Faculty
                        </option>

                        {faculties.map((faculty) => (
                          <option
                            key={faculty}
                            value={faculty}
                            className="bg-slate-900"
                          >
                            {faculty}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Department Dropdown */}

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-300">Department</Label>

                    <div className="relative flex items-center">
                      <BookOpen className="absolute left-4 top-3.5  w-4 h-4 text-slate-400 z-10" />

                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={!faculty}
                        className="w-full h-12 rounded-md border border-white/10 bg-white/5 text-white pl-11 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" className="bg-slate-900">
                          {faculty
                            ? "Select Department"
                            : "Select Faculty First"}
                        </option>

                        {faculty &&
                          departments[faculty as keyof typeof departments]?.map(
                            (department) => (
                              <option
                                key={department}
                                value={department}
                                className="bg-slate-900"
                              >
                                {department}
                              </option>
                            ),
                          )}
                      </select>

                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Level Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Level</Label>

                    <div className="relative flex items-center">
                      <GraduationCap className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 z-10" />

                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full h-12 rounded-md border border-white/10 bg-white/5 text-white pl-11 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="" className="bg-slate-900">
                          Select Level
                        </option>

                        {levels.map((level) => (
                          <option
                            key={level}
                            value={level}
                            className="bg-slate-900"
                          >
                            {level}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-slate-300">Registration Number</Label>
                <Input
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                  placeholder="e.g. U20CS1234"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-6 rounded-2xl text-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center animate-bounce text-sm text-gray-300">
                    Processing...
                  </span>
                ) : (
                  <>
                    {isRegister ? "Create Account" : "Login"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    disabled={isSubmitting}
                    onClick={() => setIsRegister(false)}
                    className="text-blue-500 hover:underline"
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    disabled={isSubmitting}
                    onClick={() => setIsRegister(true)}
                    className="text-blue-500 hover:underline"
                  >
                    Register here
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-xs text-slate-500 hover:text-white transition cursor-pointer">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
