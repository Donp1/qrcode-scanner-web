import { Router } from "express";
import { prisma } from "../db/prisma";

export const coursesRouter = Router();

/* -----------------------------
   Helpers
------------------------------*/
function badRequest(res: any, message: string) {
  return res.status(400).json({ error: message });
}

/* -----------------------------
   NORMALIZE RESPONSE
------------------------------*/
function normalizeCourse(course: any) {
  return {
    id: course.id,
    code: course.code,
    name: course.name,
    faculty: course.faculty,
    department: course.department,
    level: course.level,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,

    assignedLecturers:
      course.assignedLecturers?.map((l: any) => ({
        id: l.id,
        email: l.email,
        name: l.name,
      })) ?? [],

    registeredStudents:
      course.registeredStudents?.map((s: any) => ({
        id: s.id,
        regNumber: s.regNumber,
        name: s.name,
      })) ?? [],
  };
}

coursesRouter.get("/", async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      assignedLecturers: true,
      registeredStudents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(courses.map(normalizeCourse));
});

coursesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return badRequest(res, "Course id is required");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      assignedLecturers: true,
      registeredStudents: true,
    },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.json(normalizeCourse(course));
});

coursesRouter.post("/", async (req, res) => {
  const { code, name, faculty, department, level } = req.body ?? {};

  if (!code || typeof code !== "string")
    return badRequest(res, "code is required");

  if (!name || typeof name !== "string")
    return badRequest(res, "name is required");

  try {
    const course = await prisma.course.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        faculty: typeof faculty === "string" ? faculty.trim() : null,
        department: typeof department === "string" ? department.trim() : null,
        level: typeof level === "string" ? level.trim() : null,
      },
      include: {
        assignedLecturers: true,
        registeredStudents: true,
      },
    });

    return res.status(201).json(normalizeCourse(course));
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(400).json({
        error: "Course with this code already exists",
      });
    }

    return res.status(400).json({
      error: err?.message ?? "Failed to create course",
    });
  }
});
