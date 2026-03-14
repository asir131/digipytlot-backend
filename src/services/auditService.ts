import { AuditLog } from "../models/AuditLog.js";

export async function recordAudit(
  actorId: string | null,
  action: string,
  targetType: string,
  targetId?: string,
  metadata?: Record<string, unknown>
) {
  await AuditLog.create({ actorId, action, targetType, targetId, metadata });
}
