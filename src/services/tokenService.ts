import jwt, { SignOptions } from "jsonwebtoken";
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
  const options: SignOptions = { expiresIn: env.jwtAccessExpires as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function signRefreshToken(payload: TokenPayload) {
  const tokenId = uuidv4();
  const options: SignOptions = { expiresIn: env.jwtRefreshExpires as SignOptions["expiresIn"] };
  const token = jwt.sign({ ...payload, jti: tokenId }, env.jwtSecret, options);
  return { token, tokenId };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as TokenPayload & { jti: string };
}
