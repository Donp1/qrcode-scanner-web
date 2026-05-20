"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { base_url } from "@/constants";

type User = {
  id: string;
  name: string;
  email: string;
};

export interface Lecturer {
  id: string;
  email: string;
  name: string;
  faculty: string;
  department: string;
  assignedCourses: string[];
  password: string;
  createdAt: string;
}

export type LecturerStats = {
  totalAssignedCourses: number;
  totalStudentsRegistered: number;
  overallAverageAttendance: number;
  courses: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    totalStudentsRegistered: number;
    totalAttendanceRecords: number;
    averageAttendance: number;
  }[];
};

export function useLecturerAuth() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [stats, setStats] = useState<LecturerStats | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/lecturer");
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
          router.replace("/lecturer");
          return;
        }

        setUser(userResult.user);

        // ---------------- LECTURER ----------------
        const lecturerRes = await fetch(`${base_url}/lecturer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const lecturerResult = await lecturerRes.json();

        if (!lecturerRes.ok) {
          toast.error("Failed to fetch lecturer data. Please login again.");
          localStorage.removeItem("token");
          router.replace("/lecturer");
          return;
        }

        setLecturer(lecturerResult.user);

        // ---------------- STATS ----------------
        const statsRes = await fetch(`${base_url}/lecturer/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const statsResult = await statsRes.json();

        if (statsRes.ok) {
          setStats(statsResult.stats);
        }
      } catch (error) {
        console.error("Error validating token:", error);

        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        router.replace("/lecturer");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, [router]);

  return {
    user,
    lecturer,
    stats,
    loading,
  };
}
