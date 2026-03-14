import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { authenticate, revokeRefreshToken, rotateRefreshToken, storeRefreshToken } from "../services/authService.js";
import { recordAudit } from "../services/auditService.js";
import { AuthRequest } from "../middleware/auth.js";
import { incrementTokenVersion } from "../services/userService.js";

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.nodeEnv === "production",
  path: "/",
};

const accessCookieOptions = {
  httpOnly: false,
  sameSite: "lax" as const,
  secure: env.nodeEnv === "production",
  path: "/",
};

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken, tokenId, permissions } = await authenticate(email, password);

    const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 86400000);

    await storeRefreshToken({
      userId: user.id,
      tokenId,
      expiresAt,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
    res.cookie("access_token", accessToken, accessCookieOptions);

    await recordAudit(user.id, "auth.login", "user", user.id, { email: user.email });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleIds: user.roleIds,
        status: user.status,
        permissions,
      },
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refresh_token as string | undefined;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    const { accessToken, refreshToken, tokenId, permissions, user } = await rotateRefreshToken(
      token,
      req.get("user-agent"),
      req.ip
    );

    const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 86400000);

    await storeRefreshToken({
      userId: user.id,
      tokenId,
      expiresAt,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
    res.cookie("access_token", accessToken, accessCookieOptions);

    return res.json({ accessToken, permissions });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refresh_token as string | undefined;
    if (token) {
      await revokeRefreshToken(token);
      try {
        const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
        await incrementTokenVersion(payload.sub);
      } catch {
        // ignore
      }
    }
    res.clearCookie("refresh_token", refreshCookieOptions);
    res.clearCookie("access_token", accessCookieOptions);
    await recordAudit(null, "auth.logout", "session", undefined, { ip: req.ip });
    return res.json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
}

export async function me(req: AuthRequest, res: Response) {
  return res.json({ user: req.user });
}
