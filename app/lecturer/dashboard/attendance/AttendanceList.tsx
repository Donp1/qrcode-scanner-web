"use client";

import { Card, CardContent } from "@/components/ui/card";

type ScannedStudent = {
  studentId: string;
  name: string;
  timestamp: string;
};

type Props = {
  scannedStudents: ScannedStudent[];
  highlightedStudentId: string | null;
};

export function AttendanceList({
  scannedStudents,
  highlightedStudentId,
}: Props) {
  return (
    <Card className="bg-slate-900/80 border-white/10 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-indigo-400 text-sm uppercase tracking-[0.24em] font-semibold">
            Live attendance list
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Scanned students
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Each entry appears immediately after a successful scan.
          </p>
        </div>

        {scannedStudents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">
            No students scanned yet.
          </div>
        ) : (
          <div className="space-y-4">
            {scannedStudents.map((student) => {
              const isHighlighted = student.studentId === highlightedStudentId;
              const timestamp = new Date(student.timestamp).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              );

              return (
                <div
                  key={student.studentId}
                  className={`rounded-3xl border border-white/10 p-4 transition-all ${
                    isHighlighted
                      ? "bg-emerald-500/10 ring-2 ring-emerald-400/40 animate-pulse"
                      : "bg-white/5"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-white font-semibold">{student.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {student.studentId}
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                      {timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
