export type UserRole = "student" | "lecturer";

export interface Student {
  id: string;
  regNumber: string;
  name: string;
  faculty?: string;
  department?: string;
  level?: string;
  password: string;
  createdAt: string;
}

export interface Lecturer {
  id: string;
  email: string;
  name: string;
  faculty: string;
  department: string;
  assignedCourses: string[];
  password: string;
  createdAt: string;
}

export type Course = {
  id: string;
  code: string;
  name: string;
  faculty?: string | null;
  department?: string | null;
  level?: string | null;
  lecturers: string[];
  students: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type AnyUser = Student | Lecturer;

export interface JwtUserPayload {
  sub: string;
  role: UserRole;
  // A little convenience for client-side displays / lookups
  regNumber?: string;
  email?: string;
  name?: string;
  id?: string;
}
