import { AuditLog } from "../models/AuditLog.js";
import { getPagination } from "../utils/pagination.js";
export async function listAuditLogs(req, res) {
    const { page, limit, skip } = getPagination(req.query);
    const { action, actorId } = req.query;
    const filter = {};
    if (action)
        filter.action = action;
    if (actorId)
        filter.actorId = actorId;
    const [items, total] = await Promise.all([
        AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        AuditLog.countDocuments(filter),
    ]);
    return res.json({ items, page, limit, total });
}
