import express from "express";
import cors from "cors";

import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { coursesRouter } from "./routes/courses";
import { lecturerRouter } from "./routes/lecturer";
import { attendanceRouter } from "./routes/attendance";
import { studentRouter } from "./routes/student";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "https://qrcode-scanner-web.vercel.app", // frontend URL
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true, // if you need cookies/auth headers
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/courses", coursesRouter);
  app.use("/lecturer", lecturerRouter);
  app.use("/student", studentRouter);
  app.use("/attendance", attendanceRouter);

  // 404
  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    },
  );

  return app;
}
