import { Router } from "express";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";

export const studentRouter = Router();

function badRequest(res: any, message: string) {
  return res.status(400).json({ error: message, success: false });
}

function sanitize<T extends { passwordHash: string }>(user: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

/**
 * GET CURRENT STUDENT
 */
studentRouter.get("/", requireAuth, async (req, res) => {
  const user = await prisma.student.findUnique({
    where: { id: req.user?.id },
    include: {
      registeredCourses: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      error: "Student not found",
      success: false,
    });
  }

  return res.json({
    user: sanitize(user),
    success: true,
  });
});

/**
 * GET STUDENT STATS
 */
studentRouter.get("/stats", requireAuth, async (req, res) => {
  try {
    const studentId = req.user?.id;

    // Get student with registered courses
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        registeredCourses: {
          include: {
            attendances: true,
          },
        },
        attendances: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const registeredCourses = student.registeredCourses;

    // Total registered courses
    const totalRegisteredCourses = registeredCourses.length;

    // Total attendance records
    const totalAttendanceRecords = student.attendances.length;

    // Present attendance
    const totalPresentAttendance = student.attendances.filter(
      (attendance) => attendance.status === "PRESENT",
    ).length;

    // Absent attendance
    const totalAbsentAttendance = student.attendances.filter(
      (attendance) => attendance.status === "ABSENT",
    ).length;

    // Overall attendance percentage
    const overallAttendancePercentage =
      totalAttendanceRecords > 0
        ? Number(
            ((totalPresentAttendance / totalAttendanceRecords) * 100).toFixed(
              2,
            ),
          )
        : 0;

    // Stats for each course
    const courseStats = registeredCourses.map((course) => {
      const studentAttendances = course.attendances.filter(
        (attendance) => attendance.studentId === studentId,
      );

      const totalAttendance = studentAttendances.length;

      const presentAttendance = studentAttendances.filter(
        (attendance) => attendance.status === "PRESENT",
      ).length;

      const absentAttendance = studentAttendances.filter(
        (attendance) => attendance.status === "ABSENT",
      ).length;

      const attendancePercentage =
        totalAttendance > 0
          ? Number(((presentAttendance / totalAttendance) * 100).toFixed(2))
          : 0;

      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.name,

        totalAttendanceRecords: totalAttendance,

        presentAttendance,

        absentAttendance,

        attendancePercentage,
      };
    });

    // Best attended course
    const bestAttendedCourse =
      courseStats.length > 0
        ? [...courseStats].sort(
            (a, b) => b.attendancePercentage - a.attendancePercentage,
          )[0]
        : null;

    // Lowest attended course
    const lowestAttendedCourse =
      courseStats.length > 0
        ? [...courseStats].sort(
            (a, b) => a.attendancePercentage - b.attendancePercentage,
          )[0]
        : null;

    // Warning courses (< 75%)
    const warningCourses = courseStats.filter(
      (course) => course.attendancePercentage < 75,
    );

    // Recent attendance
    const recentAttendance = await prisma.attendance.findMany({
      where: {
        studentId,
      },
      include: {
        course: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    return res.status(200).json({
      success: true,

      student: {
        id: student.id,
        name: student.name,
        regNumber: student.regNumber,
        faculty: student.faculty,
        department: student.department,
        level: student.level,
      },

      stats: {
        totalRegisteredCourses,

        totalAttendanceRecords,

        totalPresentAttendance,

        totalAbsentAttendance,

        overallAttendancePercentage,

        bestAttendedCourse,

        lowestAttendedCourse,

        warningCourses,

        courses: courseStats,
      },

      recentAttendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * GET REGISTERED COURSES
 */
studentRouter.get("/courses", requireAuth, async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        registeredCourses: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const courses = student.registeredCourses.map((course) => ({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.name,
    }));

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Unable to load registered courses",
    });
  }
});
