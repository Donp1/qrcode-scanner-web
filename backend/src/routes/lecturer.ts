import { Router } from "express";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";

export const lecturerRouter = Router();

function badRequest(res: any, message: string) {
  return res.status(400).json({ error: message, success: false });
}

function sanitize<T extends { passwordHash: string }>(user: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}
lecturerRouter.get("/", requireAuth, async (req, res) => {
  const user = await prisma.lecturer.findUnique({
    where: { id: req.user?.id },
    include: { assignedCourses: true },
  });

  if (!user)
    return res
      .status(404)
      .json({ error: "Lecturer not found", success: false });

  return res.json({ user: sanitize(user), success: true });
});

lecturerRouter.get("/stats", requireAuth, async (req, res) => {
  try {
    const lecturerId = req.user?.id; // from auth middleware

    // Get lecturer with assigned courses
    const lecturer = await prisma.lecturer.findUnique({
      where: {
        id: lecturerId,
      },
      include: {
        assignedCourses: {
          include: {
            registeredStudents: true,
            attendances: true,
          },
        },
      },
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    const assignedCourses = lecturer.assignedCourses;

    // Total assigned courses
    const totalAssignedCourses = assignedCourses.length;

    // Total registered students across all courses
    const totalStudentsRegistered = assignedCourses.reduce(
      (acc, course) => acc + course.registeredStudents.length,
      0,
    );

    // Stats for each course
    const courseStats = assignedCourses.map((course) => {
      const totalAttendance = course.attendances.length;

      const presentAttendance = course.attendances.filter(
        (attendance) => attendance.status === "PRESENT",
      ).length;

      const averageAttendance =
        totalAttendance > 0
          ? Number(((presentAttendance / totalAttendance) * 100).toFixed(2))
          : 0;

      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.name,

        totalStudentsRegistered: course.registeredStudents.length,

        totalAttendanceRecords: totalAttendance,

        averageAttendance,
      };
    });

    // Overall attendance average
    const allAttendances = assignedCourses.flatMap(
      (course) => course.attendances,
    );

    const totalAttendanceRecords = allAttendances.length;

    const totalPresentAttendance = allAttendances.filter(
      (attendance) => attendance.status === "PRESENT",
    ).length;

    const overallAverageAttendance =
      totalAttendanceRecords > 0
        ? Number(
            ((totalPresentAttendance / totalAttendanceRecords) * 100).toFixed(
              2,
            ),
          )
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalAssignedCourses,

        totalStudentsRegistered,

        overallAverageAttendance,

        courses: courseStats,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

lecturerRouter.get("/courses", requireAuth, async (req, res) => {
  try {
    const lecturerId = req.user?.id;

    if (!lecturerId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: { assignedCourses: true },
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found",
      });
    }

    const courses = lecturer.assignedCourses.map((course) => ({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.name,
    }));

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Unable to load assigned courses",
    });
  }
});
