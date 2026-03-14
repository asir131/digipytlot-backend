import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.js";

export type TokenPayload = {
  sub: string;
  roleIds: string[];
  permissions: string[];
  status: string;
  tokenVersion: number;
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtAccessExpires });
}

export function signRefreshToken(payload: TokenPayload) {
  const tokenId = uuidv4();
  const token = jwt.sign({ ...payload, jti: tokenId }, env.jwtSecret, {
    expiresIn: env.jwtRefreshExpires,
  });
  return { token, tokenId };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as TokenPayload & { jti: string };
}
