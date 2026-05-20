import { Router } from "express";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";

export const attendanceRouter = Router();

function badRequest(res: any, message: string) {
  return res.status(400).json({ error: message, success: false });
}

attendanceRouter.post("/scan", requireAuth, async (req, res) => {
  const { studentId, courseId, type } = req.body ?? {};

  if (!studentId || typeof studentId !== "string") {
    return badRequest(res, "studentId is required");
  }

  if (!courseId || typeof courseId !== "string") {
    return badRequest(res, "courseId is required");
  }

  if (!type || !["CLASS", "TEST", "EXAM"].includes(type)) {
    return badRequest(res, "Valid attendance type is required");
  }

  try {
    const lecturerId = req.user?.id;
    if (!lecturerId) {
      return res.status(401).json({ error: "Unauthorized", success: false });
    }

    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: { assignedCourses: true },
    });

    if (!lecturer) {
      return res
        .status(404)
        .json({ error: "Lecturer not found", success: false });
    }

    const hasCourse = lecturer.assignedCourses.some(
      (course) => course.id === courseId,
    );
    if (!hasCourse) {
      return res
        .status(403)
        .json({ error: "Course not assigned to lecturer", success: false });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { registeredCourses: true },
    });

    if (
      !student ||
      !student.registeredCourses.some((course) => course.id === courseId)
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid student",
        code: "invalid_student",
      });
    }

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        courseId,
        type,
      },
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        error: "Student already marked",
        code: "duplicate",
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        lecturerId,
        courseId,
        type,
      },
    });

    return res.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
      },
      attendance: {
        id: attendance.id,
        date: attendance.date,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to record attendance",
    });
  }
});
