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

lecturerRouter.get("/students", requireAuth, async (req, res) => {
  try {
    const lecturerId = req.user?.id;

    if (!lecturerId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // optional filter from frontend
    const regNumber = req.query.regNumber as string | undefined;

    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: {
        assignedCourses: {
          include: {
            registeredStudents: {
              select: {
                id: true,
                regNumber: true,
                name: true,
                faculty: true,
                department: true,
                level: true,
              },
            },
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

    // flatten students across all courses
    let students = lecturer.assignedCourses.flatMap((course) =>
      course.registeredStudents.map((student) => ({
        ...student,
        course: {
          id: course.id,
          code: course.code,
          name: course.name,
        },
      })),
    );

    // remove duplicates (same student in multiple courses)
    const uniqueMap = new Map();

    students.forEach((s) => {
      if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
      }
    });

    students = Array.from(uniqueMap.values());

    // optional filtering by regNumber (frontend search)
    if (regNumber) {
      students = students.filter((s) =>
        s.regNumber.toLowerCase().includes(regNumber.toLowerCase()),
      );
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

lecturerRouter.get("/attendance", requireAuth, async (req, res) => {
  try {
    const lecturerId = req.user?.id;

    if (!lecturerId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { regNumber, date, type } = req.query as {
      regNumber?: string;
      date?: string;
      type?: "CLASS" | "TEST" | "EXAM";
    };

    // ================================
    // 1. Get lecturer with courses + students
    // ================================
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: {
        assignedCourses: {
          include: {
            registeredStudents: true,
          },
        },
      },
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found",
      });
    }

    const courseIds = lecturer.assignedCourses.map((c) => c.id);

    // ================================
    // 2. Build base attendance query
    // ================================
    const attendance = await prisma.attendance.findMany({
      where: {
        lecturerId,
        courseId: { in: courseIds },

        // optional filters
        ...(type ? { type } : {}),

        ...(date
          ? {
              date: {
                gte: new Date(date),
                lt: new Date(new Date(date).getTime() + 86400000),
              },
            }
          : {}),

        ...(regNumber
          ? {
              student: {
                regNumber: {
                  contains: regNumber,
                  mode: "insensitive",
                },
              },
            }
          : {}),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            regNumber: true,
            faculty: true,
            department: true,
            level: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // ================================
    // 3. Validate students belong to lecturer courses
    // (extra safety layer)
    // ================================
    const validStudentIds = new Set(
      lecturer.assignedCourses.flatMap((c) =>
        c.registeredStudents.map((s) => s.id),
      ),
    );

    const filteredAttendance = attendance.filter((a) =>
      validStudentIds.has(a.studentId),
    );

    // ================================
    // 4. Format records
    // ================================
    const records = filteredAttendance.map((a) => ({
      id: a.id,
      date: a.date,
      formattedDate: a.date.toISOString(),
      status: a.status,
      type: a.type,
      student: {
        id: a.student.id,
        name: a.student.name,
        regNumber: a.student.regNumber,
      },
      course: {
        id: a.course.id,
        code: a.course.code,
        name: a.course.name,
      },
    }));

    // ================================
    // 5. Stats calculation
    // ================================
    const totalRecords = records.length;
    const presentCount = records.filter((r) => r.status === "PRESENT").length;

    const attendancePercentage =
      totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // ================================
    // 6. Response
    // ================================
    return res.status(200).json({
      success: true,
      count: totalRecords,
      stats: {
        totalRecords,
        presentCount,
        attendancePercentage,
      },
      records,
    });
  } catch (error) {
    console.error("Attendance fetch error:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
