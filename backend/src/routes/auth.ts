import { Router } from "express";
import { prisma } from "../db/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { requireAuth } from "../middleware/auth";
import { Course, Lecturer } from "../types/auth";

export const authRouter = Router();

function badRequest(res: any, message: string) {
  return res.status(400).json({ error: message, success: false });
}

function sanitize<T extends { passwordHash: string }>(user: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

// -------------------------
// STUDENT
// -------------------------
authRouter.post("/student/register", async (req, res) => {
  const { regNumber, password, name, faculty, department, level } =
    req.body ?? {};

  if (!regNumber || typeof regNumber !== "string")
    return badRequest(res, "regNumber is required");
  if (!name || typeof name !== "string")
    return badRequest(res, "name is required");
  if (!password || typeof password !== "string")
    return badRequest(res, "password is required");
  if (password.length < 6)
    return badRequest(res, "password must be at least 6 characters");

  try {
    const passwordHash = await hashPassword(password);
    const student = await prisma.student.create({
      data: {
        regNumber: regNumber.trim().toUpperCase(),
        name: name.trim(),
        faculty: typeof faculty === "string" ? faculty.trim() : null,
        department: typeof department === "string" ? department.trim() : null,
        level: typeof level === "string" ? level.trim() : null,
        passwordHash,
      },
    });

    const token = signAccessToken({
      sub: student.id,
      role: "student",
      regNumber: student.regNumber,
      name: student.name,
      id: student.id,
    });

    return res
      .status(201)
      .json({ token, user: sanitize(student), success: true });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(400).json({
        error: "Student with this registration number already exists",
        success: false,
      });
    }
    return res.status(400).json({
      error: err?.message ?? "Failed to register student",
      success: false,
    });
  }
});

authRouter.post("/student/login", async (req, res) => {
  const { regNumber, password } = req.body ?? {};

  if (!regNumber || typeof regNumber !== "string")
    return badRequest(res, "regNumber is required");
  if (!password || typeof password !== "string")
    return badRequest(res, "password is required");

  const student = await prisma.student.findUnique({
    where: { regNumber: regNumber.trim().toUpperCase() },
  });
  if (!student)
    return res
      .status(401)
      .json({ error: "Invalid credentials", success: false });

  const ok = await verifyPassword(password, student.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ error: "Invalid credentials", success: false });

  const token = signAccessToken({
    sub: student.id,
    role: "student",
    regNumber: student.regNumber,
    name: student.name,
    id: student.id,
  });

  return res.json({ token, user: sanitize(student), success: true });
});

// -------------------------
// LECTURER
// -------------------------
authRouter.post("/lecturer/register", async (req, res) => {
  const {
    email,
    password,
    name,
    faculty,
    department,
    assignedCourses,
  }: Lecturer = req.body ?? {};

  if (!email || typeof email !== "string") {
    return badRequest(res, "email is required");
  }

  if (!name || typeof name !== "string") {
    return badRequest(res, "name is required");
  }

  if (!password || typeof password !== "string") {
    return badRequest(res, "password is required");
  }

  if (!Array.isArray(assignedCourses)) {
    return badRequest(res, "assignedCourses must be an array of course IDs");
  }

  if (!faculty || typeof faculty !== "string") {
    return badRequest(res, "faculty must be a string");
  }

  if (!department || typeof department !== "string") {
    return badRequest(res, "department must be a string");
  }

  if (password.length < 6) {
    return badRequest(res, "password must be at least 6 characters");
  }

  // Expecting array of course IDs
  const courseIds = Array.isArray(assignedCourses)
    ? assignedCourses.filter((id): id is string => typeof id === "string")
    : [];

  try {
    const passwordHash = await hashPassword(password);

    const lecturer = await prisma.lecturer.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        faculty: typeof faculty === "string" ? faculty.trim() : null,
        department: typeof department === "string" ? department.trim() : null,
        passwordHash,

        assignedCourses: {
          connect: courseIds.map((id) => ({ id })),
        },
      },

      include: {
        assignedCourses: true,
      },
    });

    const token = signAccessToken({
      sub: lecturer.id,
      role: "lecturer",
      email: lecturer.email,
      name: lecturer.name,
      id: lecturer.id,
    });

    return res.status(201).json({
      success: true,
      token,
      user: sanitize(lecturer),
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(400).json({
        error: "Lecturer with this email already exists",
        success: false,
      });
    }

    return res.status(400).json({
      error: err?.message ?? "Failed to register lecturer",
      success: false,
    });
  }
});

authRouter.post("/lecturer/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || typeof email !== "string")
    return badRequest(res, "email is required");
  if (!password || typeof password !== "string")
    return badRequest(res, "password is required");

  const lecturer = await prisma.lecturer.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!lecturer)
    return res
      .status(401)
      .json({ error: "Invalid credentials", success: false });

  const ok = await verifyPassword(password, lecturer.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ error: "Invalid credentials", success: false });

  const token = signAccessToken({
    sub: lecturer.id,
    role: "lecturer",
    email: lecturer.email,
    name: lecturer.name,
    id: lecturer.id,
  });

  return res.json({ token, user: sanitize(lecturer), success: true });
});

// -------------------------
// ME (optional helper)
// -------------------------
authRouter.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.user });
});
