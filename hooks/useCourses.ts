import { base_url } from "@/constants";
import { useEffect, useState } from "react";

export type Course = {
  id: string;
  code: string;
  name: string;
  faculty?: string | null;
  department?: string | null;
  level?: string | null;
};

export type DepartmentCourse = {
  id: string;
  code: string;
  title: string;
};

export function useCourses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${base_url}/courses`);

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();

        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* -----------------------------
     FACULTIES (dynamic)
  ------------------------------*/
  const faculties = Array.from(
    new Set(courses.map((c) => c.faculty).filter(Boolean)),
  ) as string[];

  /* -----------------------------
     DEPARTMENTS (grouped by faculty)
  ------------------------------*/
  const departments: Record<string, string[]> = faculties.reduce(
    (acc, faculty) => {
      acc[faculty] = Array.from(
        new Set(
          courses
            .filter((c) => c.faculty === faculty)
            .map((c) => c.department)
            .filter(Boolean),
        ),
      ) as string[];

      return acc;
    },
    {} as Record<string, string[]>,
  );

  /* -----------------------------
     DEPARTMENT COURSES
  ------------------------------*/
  const departmentCourses: Record<string, DepartmentCourse[]> = courses.reduce(
    (acc, course) => {
      if (!course.department) return acc;

      if (!acc[course.department]) {
        acc[course.department] = [];
      }

      acc[course.department].push({
        id: course.id,
        code: course.code,
        title: course.name,
      });

      return acc;
    },
    {} as Record<string, DepartmentCourse[]>,
  );

  return {
    loading,
    courses,
    faculties,
    departments,
    departmentCourses,
  };
}
