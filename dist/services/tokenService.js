import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.js";
export function signAccessToken(payload) {
    const options = { expiresIn: env.jwtAccessExpires };
    return jwt.sign(payload, env.jwtSecret, options);
}
export function signRefreshToken(payload) {
    const tokenId = uuidv4();
    const options = { expiresIn: env.jwtRefreshExpires };
    const token = jwt.sign({ ...payload, jti: tokenId }, env.jwtSecret, options);
    return { token, tokenId };
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwtSecret);
}
