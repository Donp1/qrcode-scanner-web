"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Course, useCourses } from "@/hooks/useCourses";
import { base_url, levels } from "@/constants";
import toast from "react-hot-toast";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function MyCourses() {
  const { student, loading: studentLoading } = useStudentAuth();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    [],
  );
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>(
    student?.registeredCourses || [],
  );

  const {
    courses,
    departments,
    faculties,
    loading: courseLoading,
  } = useCourses();

  useEffect(() => {
    if (student) {
      setRegisteredCourses(student.registeredCourses || []);
    }
  }, [student]);

  // Reset faculty change
  useEffect(() => {
    if (selectedFaculty) {
      setAvailableDepartments(departments[selectedFaculty] || []);
      setSelectedDepartment("");
      setSelectedCourse(null);
      setAvailableCourses([]);
    }
  }, [selectedFaculty]);

  // Filter courses when department OR level changes
  useEffect(() => {
    if (!selectedDepartment || !selectedLevel) return;

    const filtered = courses.filter((course) => {
      return (
        course.faculty?.toLowerCase() === selectedFaculty.toLowerCase() &&
        course.department?.toLowerCase() === selectedDepartment.toLowerCase() &&
        course.level === selectedLevel
      );
    });

    setAvailableCourses(filtered);
    setSelectedCourse(null);
  }, [selectedDepartment, selectedLevel]);

  const registerCourse = async () => {
    setIsRegistering(true);
    if (
      !selectedLevel ||
      !selectedFaculty ||
      !selectedDepartment ||
      !selectedCourse
    ) {
      toast.error("Please select all fields before registering.");
      setIsRegistering(false);
      return;
    }

    const exists = registeredCourses.some((c) => c.id === selectedCourse.id);

    if (exists) {
      toast.error("Course already registered.");
      setIsRegistering(false);
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${base_url}/student/courses/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: selectedCourse.id,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to register course.");
      setIsRegistering(false);
      return;
    }

    const data = await res.json();

    if (!data.success) {
      toast.error(data.error || "Failed to register course.");
      setIsRegistering(false);
      return;
    }

    setRegisteredCourses((prev) => [...prev, data?.newCourse]);
    toast.success("Course registered successfully.");
    setIsRegistering(false);
    setSelectedLevel("");
    setSelectedFaculty("");
    setSelectedDepartment("");
    setSelectedCourse(null);
  };

  return (
    <>
      {courseLoading || studentLoading ? (
        <div className="max-w-4xl mx-auto p-6 bg-slate-950 min-h-screen text-white flex items-center justify-center">
          <span className="animate-bounce">Loading...</span>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-slate-950 min-h-screen text-white rounded-lg">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-6 text-indigo-400"
          >
            My Courses
          </motion.h1>

          {/* FORM */}
          <div className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
            <FormField
              label="Level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              options={levels}
            />

            <FormField
              label="Faculty"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              options={faculties}
              disabled={!selectedLevel}
            />

            <FormField
              label="Department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              options={availableDepartments}
              disabled={!selectedFaculty}
            />

            {/* COURSE SELECT FIXED */}
            <div>
              <label className="block font-semibold mb-1 text-gray-300">
                Course
              </label>
              <select
                value={selectedCourse?.id || ""}
                onChange={(e) => {
                  const course = availableCourses.find(
                    (c) => c.id === e.target.value,
                  );
                  setSelectedCourse(course || null);
                }}
                disabled={availableCourses.length === 0 || !selectedDepartment}
                className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Course</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={registerCourse}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <span className="animate-bounce text-md text-gray-400">
                  loading...
                </span>
              ) : (
                "Register Course"
              )}
            </button>
          </div>

          {/* REGISTERED */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-indigo-300">
                Registered Courses
              </h2>

              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {registeredCourses.length} course
                {registeredCourses.length !== 1 ? "s" : ""}
              </span>
            </div>

            {registeredCourses.length === 0 ? (
              <div className="text-center py-10 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-gray-400">No courses registered yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Register courses to see them here
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {registeredCourses.map((c) => (
                  <div
                    key={c.id}
                    className="group flex items-start justify-between bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-lg p-4"
                  >
                    {/* Left side */}
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-indigo-400 mt-1" />

                      <div>
                        <p className="font-semibold text-white group-hover:text-indigo-300 transition">
                          {c.code} — {c.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {c.department} • {c.faculty} • Level {c.level}
                        </p>
                      </div>
                    </div>

                    {/* Right badge */}
                    <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
                      Registered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- FORM FIELD ---------------- */
function FormField({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-gray-300">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
