import { Router } from "express";
import { login, logout, me, refresh } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
const router = Router();
const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
    params: z.object({}),
    query: z.object({}),
});
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/refresh", authRateLimiter, refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
export default router;
