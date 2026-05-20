"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ATTENDANCE_TYPES = ["CLASS", "TEST", "EXAM"] as const;

type AttendanceType = (typeof ATTENDANCE_TYPES)[number];

type CourseOption = {
  courseId: string;
  courseCode: string;
  courseTitle: string;
};

type Props = {
  courses: CourseOption[];
  isLoading: boolean;
  selectedCourseId: string;
  attendanceType: string;
  onSelectCourse: (courseId: string) => void;
  onSelectType: (type: AttendanceType) => void;
  onStart: () => void;
};

export function SessionSetupPanel({
  courses,
  isLoading,
  selectedCourseId,
  attendanceType,
  onSelectCourse,
  onSelectType,
  onStart,
}: Props) {
  return (
    <Card className="bg-slate-900/80 border-white/10 shadow-xl">
      <CardContent className="space-y-6 p-5 sm:p-6">
        <div>
          <p className="text-indigo-400 text-sm uppercase tracking-[0.3em] font-semibold">
            Session setup
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Start attendance tracking
          </h2>
          <p className="mt-2 text-slate-400">
            Select a course and attendance type before opening the scanner.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="course-select" className="text-slate-200">
              Select course
            </Label>
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={(event) => onSelectCourse(event.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading courses..." : "Choose a course"}
              </option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseCode} - {course.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-200">Attendance type</Label>
            <div className="grid grid-cols-3 gap-3">
              {ATTENDANCE_TYPES.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={attendanceType === type ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onSelectType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-slate-400 text-sm">
              Scan student QR codes for the selected course session.
            </p>
          </div>

          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!selectedCourseId || !attendanceType}
            onClick={onStart}
          >
            Start Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
