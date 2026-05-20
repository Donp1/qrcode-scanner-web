"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type CourseOption = {
  courseId: string;
  courseCode: string;
  courseTitle: string;
};

type Props = {
  course: CourseOption;
  type: "CLASS" | "TEST" | "EXAM";
  onEndSession: () => void;
};

export function ActiveSessionHeader({ course, type, onEndSession }: Props) {
  return (
    <Card className="bg-slate-900/80 border-white/10 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Active
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-100 border-white/10"
              >
                {type}
              </Badge>
            </div>

            <div>
              <p className="text-slate-400 text-sm uppercase tracking-[0.3em] font-semibold">
                Active session
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {course.courseCode} · {course.courseTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Session Status
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-400">
                ACTIVE
              </p>
            </div>
            <Button variant="destructive" onClick={onEndSession}>
              End Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
