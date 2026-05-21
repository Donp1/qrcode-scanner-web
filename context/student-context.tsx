"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

type StudentContextValue = ReturnType<typeof useStudentAuth>;

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const value = useStudentAuth();
  // keep stable reference when possible
  const memoed = useMemo(() => value, [value.user, value.student, value.stats, value.recentAttendance, value.loading]);
  return <StudentContext.Provider value={memoed}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
}

