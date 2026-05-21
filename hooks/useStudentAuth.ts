"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { base_url } from "@/constants";

type JwtUser = {
  sub: string;
  role: "student" | "lecturer";
  id?: string;
  name?: string;
  regNumber?: string;
  email?: string;
};

export interface Student {
  id: string;
  regNumber: string;
  name: string;
  faculty: string;
  department: string;
  level: string;
  registeredCourses: {
    id: string;
    code: string;
    name: string;
    faculty: string;
    department: string;
    level: string;
  }[];
  createdAt: string;
}

export type StudentStats = {
  totalRegisteredCourses: number;

  totalAttendanceRecords: number;

  totalPresentAttendance: number;

  totalAbsentAttendance: number;

  overallAttendancePercentage: number;

  bestAttendedCourse: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    totalAttendanceRecords: number;
    presentAttendance: number;
    absentAttendance: number;
    attendancePercentage: number;
  } | null;

  lowestAttendedCourse: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    totalAttendanceRecords: number;
    presentAttendance: number;
    absentAttendance: number;
    attendancePercentage: number;
  } | null;

  warningCourses: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    totalAttendanceRecords: number;
    presentAttendance: number;
    absentAttendance: number;
    attendancePercentage: number;
  }[];

  courses: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    totalAttendanceRecords: number;
    presentAttendance: number;
    absentAttendance: number;
    attendancePercentage: number;
  }[];
};

export type RecentAttendance = {
  id: string;
  status: "PRESENT" | "ABSENT";
  type: string;
  date: string;

  course: {
    id: string;
    code: string;
    name: string;
    faculty: string;
    department: string;
    level: string;
  };
};

export function useStudentAuth() {
  const router = useRouter();

  const [user, setUser] = useState<JwtUser | null>(null);

  const [student, setStudent] = useState<Student | null>(null);

  const [stats, setStats] = useState<StudentStats | null>(null);

  const [recentAttendance, setRecentAttendance] = useState<RecentAttendance[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/student");
          return;
        }

        // ---------------- USER ----------------
        const userRes = await fetch(`${base_url}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const userResult = await userRes.json();

        if (!userRes.ok || !userResult.user) {
          toast.error("Session expired. Please login again.");

          localStorage.removeItem("token");

          router.replace("/student");

          return;
        }

        const jwtUser = userResult.user as JwtUser;

        if (jwtUser.role !== "student") {
          toast.error("Please login as a student.");
          localStorage.removeItem("token");
          router.replace("/student");
          return;
        }

        setUser(jwtUser);

        // ---------------- STUDENT ----------------
        const studentRes = await fetch(`${base_url}/student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const studentResult = await studentRes.json();

        if (!studentRes.ok) {
          toast.error("Failed to fetch student data. Please login again.");

          localStorage.removeItem("token");

          router.replace("/student");

          return;
        }

        setStudent(studentResult.user);

        // ---------------- STATS ----------------
        const statsRes = await fetch(`${base_url}/student/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const statsResult = await statsRes.json();

        if (statsRes.ok) {
          setStats(statsResult.stats);

          setRecentAttendance(statsResult.recentAttendance || []);
        }
      } catch (error) {
        console.error("Error validating token:", error);

        toast.error("Session expired. Please login again.");

        localStorage.removeItem("token");

        router.replace("/student");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, [router]);

  return {
    user,
    student,
    stats,
    recentAttendance,
    loading,
  };
}
