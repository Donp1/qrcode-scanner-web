"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const faculties = ["Science", "Engineering", "Arts"];
const departments: Record<string, string[]> = {
  Science: ["Computer Science", "Biology", "Chemistry"],
  Engineering: ["Electrical", "Mechanical", "Civil"],
  Arts: ["History", "Languages", "Philosophy"],
};
const levels = ["100", "200", "300", "400", "500"];
const courses: Record<string, string[]> = {
  "Computer Science": ["Data Structures", "Algorithms", "Databases"],
  Biology: ["Genetics", "Ecology", "Microbiology"],
  Chemistry: ["Organic Chemistry", "Inorganic Chemistry"],
  Electrical: ["Circuit Analysis", "Electromagnetics"],
  Mechanical: ["Thermodynamics", "Fluid Mechanics"],
  Civil: ["Structural Analysis", "Geotechnical Engineering"],
  History: ["World History", "African History"],
  Languages: ["English", "French", "Arabic"],
  Philosophy: ["Ethics", "Logic"],
};

export default function MyCourses() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    [],
  );
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);

  const [registeredCourses, setRegisteredCourses] = useState<
    { level: string; faculty: string; department: string; course: string }[]
  >([]);

  useEffect(() => {
    if (selectedFaculty) {
      setAvailableDepartments(departments[selectedFaculty]);
      setSelectedDepartment("");
      setSelectedCourse("");
      setAvailableCourses([]);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedDepartment) {
      setAvailableCourses(courses[selectedDepartment]);
      setSelectedCourse("");
    }
  }, [selectedDepartment]);

  const registerCourse = () => {
    if (
      !selectedLevel ||
      !selectedFaculty ||
      !selectedDepartment ||
      !selectedCourse
    ) {
      alert("Please select all fields before registering.");
      return;
    }

    const newCourse = {
      level: selectedLevel,
      faculty: selectedFaculty,
      department: selectedDepartment,
      course: selectedCourse,
    };

    const exists = registeredCourses.find(
      (c) =>
        c.level === newCourse.level &&
        c.faculty === newCourse.faculty &&
        c.department === newCourse.department &&
        c.course === newCourse.course,
    );

    if (exists) {
      alert("Course already registered.");
      return;
    }

    setRegisteredCourses([...registeredCourses, newCourse]);
    alert("Course registered successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 min-h-screen text-white rounded-lg">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        My Courses
      </motion.h1>

      {/* Registration Form */}
      <div className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10 shadow-md">
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
        />

        <FormField
          label="Department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          options={availableDepartments}
          disabled={availableDepartments.length === 0}
        />

        <FormField
          label="Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          options={availableCourses}
          disabled={availableCourses.length === 0}
        />

        <button
          onClick={registerCourse}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
        >
          Register Course
        </button>
      </div>

      {/* Registered Courses */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-indigo-300">
          Registered Courses
        </h2>
        {registeredCourses.length === 0 ? (
          <p className="text-gray-400">No courses registered yet.</p>
        ) : (
          <ul className="space-y-2">
            {registeredCourses.map((c, idx) => (
              <motion.li
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center bg-slate-900 border border-white/10 px-4 py-2 rounded hover:bg-slate-800 transition"
              >
                <CheckCircle className="mr-2 text-indigo-400" />
                {`${c.level} - ${c.faculty} - ${c.department} - ${c.course}`}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

/* ---------------- Reusable Form Field ---------------- */
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
        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
