import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import type { JwtUserPayload } from "../types/auth";

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Default only for local dev. Set JWT_SECRET in production.
    return "dev-secret-change-me";
  }
  return secret;
}

export function signAccessToken(payload: JwtUserPayload) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyAccessToken(token: string): JwtUserPayload {
  return jwt.verify(token, getJwtSecret()) as JwtUserPayload;
}
