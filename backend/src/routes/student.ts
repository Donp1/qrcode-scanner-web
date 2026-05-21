import { Router } from "express";
import { prisma } from "../db/prisma";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/auth";

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
studentRouter.get(
  "/",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    const user = await prisma.student.findUnique({
      where: { id: req.user?.id ?? req.user?.sub },
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
  },
);

/**
 * GET STUDENT STATS
 */
studentRouter.get(
  "/stats",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    try {
      const studentId = req.user?.id ?? req.user?.sub;

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
  },
);

/**
 * GET REGISTERED COURSES
 */
studentRouter.get(
  "/courses",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    try {
      const studentId = req.user?.id ?? req.user?.sub;

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
  },
);

/**
 * REGISTER COURSE (connect student <-> course)
 * body: { courseId: string }
 */
studentRouter.post(
  "/courses/register",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    const studentId = req.user?.id ?? req.user?.sub;
    const { courseId } = req.body ?? {};

    if (!studentId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!courseId || typeof courseId !== "string") {
      return badRequest(res, "courseId is required");
    }

    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!course) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }

      const updated = await prisma.student.update({
        where: { id: studentId },
        data: {
          registeredCourses: {
            connect: { id: courseId },
          },
        },
        include: { registeredCourses: true },
      });

      if (!updated) {
        return res.status(400).json({
          success: false,
          error: "Unable to register course",
        });
      }

      const newCourse = await prisma.course.findUnique({
        where: { id: courseId },
      });

      return res.status(200).json({
        success: true,
        newCourse,
      });
    } catch (err: any) {
      // Unique constraint may be thrown depending on relation table
      return res.status(400).json({
        success: false,
        error: err?.message ?? "Unable to register course",
      });
    }
  },
);

/**
 * UNREGISTER COURSE (disconnect student <-> course)
 */
studentRouter.delete(
  "/courses/:courseId",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    const studentId = req.user?.id ?? req.user?.sub;
    const { courseId } = req.params;

    if (!studentId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!courseId || typeof courseId !== "string") {
      return badRequest(res, "courseId is required");
    }

    try {
      const updated = await prisma.student.update({
        where: { id: studentId },
        data: {
          registeredCourses: {
            disconnect: { id: courseId },
          },
        },
        include: { registeredCourses: true },
      });

      return res.status(200).json({
        success: true,
        user: sanitize(updated),
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err?.message ?? "Unable to unregister course",
      });
    }
  },
);
