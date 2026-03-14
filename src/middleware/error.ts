import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }
  logger.error("Unhandled error", err);
  return res.status(500).json({ message: "Internal server error" });
}
