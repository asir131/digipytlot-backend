import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { badRequest } from "../utils/errors.js";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      return next(badRequest("Validation failed", result.error.flatten()));
    }
    Object.assign(req, result.data);
    return next();
  };
}
