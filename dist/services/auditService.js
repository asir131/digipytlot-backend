import { AuditLog } from "../models/AuditLog.js";
export async function recordAudit(actorId, action, targetType, targetId, metadata) {
    await AuditLog.create({ actorId, action, targetType, targetId, metadata });
}
