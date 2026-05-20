"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { base_url } from "@/constants";
import { useLecturerAuth } from "@/hooks/useLecturerAuth";
import { ActiveSessionHeader } from "./ActiveSessionHeader";
import { AttendanceList } from "./AttendanceList";
import { AttendanceScanner } from "./AttendanceScanner";
import { SessionSetupPanel } from "./SessionSetupPanel";
import { Card, CardContent } from "@/components/ui/card";
import { useCameraPermission } from "@/hooks/cameraPermission";

const ATTENDANCE_TYPES = ["CLASS", "TEST", "EXAM"] as const;

type AttendanceType = (typeof ATTENDANCE_TYPES)[number];

type CourseOption = {
  courseId: string;
  courseCode: string;
  courseTitle: string;
};

type ScannedStudent = {
  studentId: string;
  name: string;
  timestamp: string;
};

export default function LecturerAttendancePage() {
  const router = useRouter();
  const { loading } = useLecturerAuth();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [attendanceType, setAttendanceType] = useState<AttendanceType | "">("");
  const [activeSession, setActiveSession] = useState<{
    course: CourseOption;
    type: AttendanceType;
  } | null>(null);
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isLoadingScan, setIsLoadingScan] = useState(false);
  const [highlightedStudentId, setHighlightedStudentId] = useState<
    string | null
  >(null);

  const lastScanRef = useRef<number>(0);

  const activeCourse = activeSession?.course;
  const sessionActive = Boolean(activeSession);

  useEffect(() => {
    if (loading) return;

    const fetchCourses = async () => {
      setLoadingCourses(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/lecturer");
          return;
        }

        const response = await fetch(`${base_url}/lecturer/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.error || "Unable to load assigned courses.");
          return;
        }

        setCourses(data.courses ?? []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load courses. Please try again.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [loading, router]);

  useEffect(() => {
    if (!highlightedStudentId) return;
    const timer = window.setTimeout(() => setHighlightedStudentId(null), 1800);
    return () => window.clearTimeout(timer);
  }, [highlightedStudentId]);

  const selectedCourse = useMemo(
    () =>
      courses.find((course) => course.courseId === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  const handleStartSession = () => {
    if (!selectedCourse || !attendanceType) return;
    setActiveSession({ course: selectedCourse, type: attendanceType });
    setScannerError(null);
    setScannedStudents([]);
    toast.success("Session started. Scanner is ready.");
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setSelectedCourseId("");
    setAttendanceType("");
    toast("Session ended. Attendance is frozen.");
  };

  const handleScanResult = async (decodedText: string) => {
    if (!sessionActive || !activeSession) return;

    const now = Date.now();
    if (now - lastScanRef.current < 2500) {
      return;
    }
    lastScanRef.current = now;

    let payload: { studentId?: string };

    try {
      payload = JSON.parse(decodedText);
    } catch {
      setScannerError("Invalid QR code. Scan a valid student JSON payload.");
      toast.error("Invalid QR code format.");
      return;
    }

    const studentId = payload?.studentId;
    if (typeof studentId !== "string" || !studentId.trim()) {
      setScannerError("QR code missing studentId.");
      toast.error("Invalid QR code content.");
      return;
    }

    if (scannedStudents.some((item) => item.studentId === studentId)) {
      toast("Student already marked.", { icon: "⚠️" });
      return;
    }

    setScannerError(null);
    setIsLoadingScan(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        router.replace("/lecturer");
        return;
      }

      const response = await fetch(`${base_url}/attendance/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          courseId: activeSession.course.courseId,
          type: activeSession.type,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.code === "duplicate") {
          toast("Student already marked.", { icon: "⚠️" });
          return;
        }

        if (result.code === "invalid_student") {
          toast.error("Invalid student.");
          return;
        }

        toast.error(result.error || "Unable to submit attendance.");
        return;
      }

      const studentName = result.student?.name ?? "Unknown student";
      const timestamp = result.attendance?.date ?? new Date().toISOString();

      const newEntry = {
        studentId,
        name: studentName,
        timestamp,
      };

      setScannedStudents((prev) => [newEntry, ...prev]);
      setHighlightedStudentId(studentId);
      toast.success("Attendance marked successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark attendance.");
    } finally {
      setIsLoadingScan(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <p className="text-indigo-400 text-sm uppercase tracking-[0.24em] font-semibold">
            Lecturer attendance
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Start a session and scan student QR codes
          </h1>
          <p className="max-w-3xl text-slate-400">
            Choose the course and attendance type, then let the scanner watch
            for valid student QR payloads.
          </p>
        </div>

        {!sessionActive ? (
          <SessionSetupPanel
            courses={courses}
            isLoading={loadingCourses}
            selectedCourseId={selectedCourseId}
            attendanceType={attendanceType}
            onSelectCourse={setSelectedCourseId}
            onSelectType={(type) => setAttendanceType(type as AttendanceType)}
            onStart={handleStartSession}
          />
        ) : (
          <ActiveSessionHeader
            course={activeSession!.course}
            type={activeSession!.type}
            onEndSession={handleEndSession}
          />
        )}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <Card className="bg-slate-900/80 border-white/10 shadow-xl">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-[0.24em] font-semibold">
                      QR Scanner
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      {sessionActive ? "Scanner is live" : "Scanner is waiting"}
                    </h2>
                  </div>
                  <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                    {sessionActive ? "Active session" : "No active session"}
                  </div>
                </div>

                <AttendanceScanner
                  active={sessionActive}
                  onScan={handleScanResult}
                  onError={(message) => {
                    setScannerError(message);
                    if (message) toast.error(message);
                  }}
                />

                {scannerError && (
                  <div className="mt-4 rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
                    {scannerError}
                  </div>
                )}

                {isLoadingScan && (
                  <div className="mt-4 rounded-3xl bg-slate-800/80 border border-white/10 p-4 text-sm text-slate-200">
                    Processing scan... please wait.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <AttendanceList
            scannedStudents={scannedStudents}
            highlightedStudentId={highlightedStudentId}
          />
        </div>
      </div>
    </div>
  );
}
