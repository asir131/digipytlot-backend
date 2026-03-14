import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";
import { badRequest, unauthorized } from "../utils/errors.js";
import { comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./tokenService.js";
import { Role } from "../models/Role.js";
import { mergePermissions } from "../utils/permissions.js";
export async function authenticate(email, password) {
    const user = await User.findOne({ email });
    if (!user)
        throw unauthorized("Invalid credentials");
    if (user.status !== "active")
        throw unauthorized("Account not active");
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok)
        throw unauthorized("Invalid credentials");
    const roles = await Role.find({ _id: { $in: user.roleIds } });
    const permissions = mergePermissions(user, roles);
    const payload = {
        sub: user.id,
        roleIds: user.roleIds.map((id) => id.toString()),
        permissions,
        status: user.status,
        tokenVersion: user.tokenVersion,
    };
    const accessToken = signAccessToken(payload);
    const { token: refreshToken, tokenId } = signRefreshToken(payload);
    return { user, accessToken, refreshToken, tokenId, permissions };
}
export async function storeRefreshToken(data) {
    await RefreshToken.create({
        userId: data.userId,
        tokenId: data.tokenId,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ip: data.ip,
    });
}
export async function rotateRefreshToken(oldToken, userAgent, ip) {
    const payload = verifyRefreshToken(oldToken);
    const tokenDoc = await RefreshToken.findOne({ tokenId: payload.jti, userId: payload.sub });
    if (!tokenDoc || tokenDoc.revokedAt)
        throw unauthorized("Refresh token revoked");
    if (tokenDoc.expiresAt < new Date())
        throw unauthorized("Refresh token expired");
    const user = await User.findById(payload.sub);
    if (!user)
        throw unauthorized("User not found");
    if (user.status !== "active")
        throw unauthorized("Account not active");
    if (user.tokenVersion !== payload.tokenVersion)
        throw unauthorized("Session expired");
    const roles = await Role.find({ _id: { $in: user.roleIds } });
    const permissions = mergePermissions(user, roles);
    const newPayload = {
        sub: user.id,
        roleIds: user.roleIds.map((id) => id.toString()),
        permissions,
        status: user.status,
        tokenVersion: user.tokenVersion,
    };
    const accessToken = signAccessToken(newPayload);
    const { token: refreshToken, tokenId } = signRefreshToken(newPayload);
    tokenDoc.revokedAt = new Date();
    tokenDoc.replacedByTokenId = tokenId;
    await tokenDoc.save();
    return { accessToken, refreshToken, tokenId, permissions, user };
}
export async function revokeRefreshToken(token) {
    try {
        const payload = verifyRefreshToken(token);
        await RefreshToken.findOneAndUpdate({ tokenId: payload.jti, userId: payload.sub }, { revokedAt: new Date() });
    }
    catch {
        throw badRequest("Invalid refresh token");
    }
}
