"use client";

import { use, useState } from "react";

import { motion } from "framer-motion";

import {
  Mail,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { base_url } from "@/constants";
import { useCourses } from "@/hooks/useCourses";
import toast from "react-hot-toast";

export default function LecturerAuthPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    faculty: "",
    department: "",
  });

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { courses, departmentCourses, departments, faculties, loading } =
    useCourses();

  const filteredCourses =
    departmentCourses[formData.department as keyof typeof departmentCourses] ||
    [];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset selected courses when department changes
    if (field === "department") {
      setSelectedCourses([]);
    }
  };

  const handleFacultyChange = (faculty: string) => {
    setFormData((prev) => ({
      ...prev,
      faculty,
      department: "",
    }));

    setSelectedCourses([]);
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      const lecturerData = {
        ...formData,
        assignedCourses: selectedCourses,
      };

      setIsSubmitting(true);

      const res = await fetch(`${base_url}/auth/lecturer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lecturerData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to register lecturer:", error);
        toast.error(error.error || "Failed to register lecturer");
        setIsSubmitting(false);
        return;
      }

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "Failed to register lecturer");
        setIsSubmitting(false);
        return;
      }

      toast.success("Lecturer registered successfully! Please login.");
      localStorage.clear();
      localStorage.setItem("token", result.token);
      router.replace("/lecturer/dashboard");
    } else {
      const lecturerData = {
        ...formData,
      };

      setIsSubmitting(true);

      const res = await fetch(`${base_url}/auth/lecturer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: lecturerData.email,
          password: lecturerData.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to login lecturer:", error);
        toast.error(error.error || "Failed to login lecturer");
        setIsSubmitting(false);
        return;
      }

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "Failed to login lecturer");
        setIsSubmitting(false);
        return;
      }

      toast.success("Lecturer logged in successfully!");
      localStorage.clear();
      localStorage.setItem("token", result.token);
      router.replace("/lecturer/dashboard");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
        {loading ? (
          <p className="text-slate-500">Loading courses...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
              {/* Header */}
              <CardHeader className="text-center border-b border-white/10 pb-8">
                <div className="flex justify-center mb-5">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
                    <GraduationCap className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>

                <CardTitle className="text-3xl font-bold text-white">
                  {isRegister ? "Lecturer Registration" : "Lecturer Login"}
                </CardTitle>

                <p className="text-slate-400 mt-2">
                  {isRegister
                    ? "Create a lecturer account and assign courses"
                    : "Access your lecturer dashboard"}
                </p>
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Registration Fields */}
                  {isRegister && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">Full Name</Label>

                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />

                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Dr. John Doe"
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
                          />
                        </div>
                      </div>

                      {/* Faculty Dropdown */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">Faculty</Label>

                        <div className="relative">
                          <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 z-10" />

                          <select
                            value={formData.faculty}
                            onChange={(e) =>
                              handleFacultyChange(e.target.value)
                            }
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

                        <div className="relative">
                          <BookOpen className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 z-10" />

                          <select
                            value={formData.department}
                            onChange={(e) =>
                              handleInputChange("department", e.target.value)
                            }
                            disabled={!formData.faculty}
                            className="w-full h-12 rounded-md border border-white/10 bg-white/5 text-white pl-11 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="" className="bg-slate-900">
                              {formData.faculty
                                ? "Select Department"
                                : "Select Faculty First"}
                            </option>

                            {formData.faculty &&
                              departments[
                                formData.faculty as keyof typeof departments
                              ]?.map((department) => (
                                <option
                                  key={department}
                                  value={department}
                                  className="bg-slate-900"
                                >
                                  {department}
                                </option>
                              ))}
                          </select>

                          <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email + Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-slate-300">Email Address</Label>

                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />

                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="lecturer@university.edu"
                          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label className="text-slate-300">Password</Label>

                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />

                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="••••••••"
                          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Assignment */}
                  {isRegister && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Assign Courses
                        </h3>

                        <p className="text-slate-400 text-sm mt-1">
                          Select the courses this lecturer will manage and take
                          attendance for.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!formData.department ? (
                          <div className="md:col-span-2 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-slate-400">
                              Select a department to view available courses
                            </p>
                          </div>
                        ) : filteredCourses.length === 0 ? (
                          <div className="md:col-span-2 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-slate-400">
                              No courses available for this department
                            </p>
                          </div>
                        ) : (
                          filteredCourses.map((course) => {
                            const selected = selectedCourses.includes(
                              course.id,
                            );

                            return (
                              <button
                                type="button"
                                key={course.id}
                                onClick={() => toggleCourse(course.id)}
                                className={`rounded-2xl border p-5 text-left transition-all ${
                                  selected
                                    ? "border-indigo-500 bg-indigo-500/10"
                                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <BookOpen className="w-4 h-4 text-indigo-400" />

                                      <span className="text-indigo-400 font-semibold">
                                        {course.code}
                                      </span>
                                    </div>

                                    <h4 className="text-white font-medium">
                                      {course.title}
                                    </h4>
                                  </div>

                                  <div
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                      selected
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "border-slate-500"
                                    }`}
                                  >
                                    {selected && (
                                      <Check className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Selected Courses */}
                      <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white">
                            Selected Courses
                          </h4>

                          <span className="text-indigo-400 font-semibold">
                            {selectedCourses.length} Selected
                          </span>
                        </div>

                        {selectedCourses.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No courses selected yet.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-3">
                            {filteredCourses
                              .filter((course) =>
                                selectedCourses.includes(course.id),
                              )
                              .map((course) => (
                                <div
                                  key={course.id}
                                  className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-sm text-indigo-300"
                                >
                                  {course.code}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-bounce">Loading...</span>
                    ) : isRegister ? (
                      "Create Lecturer Account"
                    ) : (
                      "Login to Dashboard"
                    )}
                  </Button>
                </form>

                {/* Toggle */}
                <div className="text-center text-sm text-slate-400 mt-8">
                  {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {isRegister ? "Login" : "Register"}
                  </button>
                </div>

                {/* Back */}
                <div className="text-center mt-5">
                  <Link
                    href="/"
                    className="text-sm text-slate-500 hover:text-slate-300 transition"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}
