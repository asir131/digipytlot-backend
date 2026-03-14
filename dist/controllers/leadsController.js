import { Lead } from "../models/Lead.js";
import { getPagination } from "../utils/pagination.js";
import { recordAudit } from "../services/auditService.js";
import { notFound } from "../utils/errors.js";
export async function listLeads(req, res) {
    const { page, limit, skip } = getPagination(req.query);
    const { q, status, ownerId } = req.query;
    const filter = {};
    if (q)
        filter.$text = { $search: q };
    if (status)
        filter.status = status;
    if (ownerId)
        filter.ownerId = ownerId;
    const [items, total] = await Promise.all([
        Lead.find(filter).skip(skip).limit(limit).lean(),
        Lead.countDocuments(filter),
    ]);
    return res.json({ items, page, limit, total });
}
export async function createLead(req, res, next) {
    try {
        const lead = await Lead.create(req.body);
        await recordAudit(req.user?.id ?? null, "lead.create", "lead", lead.id);
        return res.status(201).json({ lead });
    }
    catch (error) {
        return next(error);
    }
}
export async function updateLead(req, res, next) {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lead)
            throw notFound("Lead not found");
        await recordAudit(req.user?.id ?? null, "lead.update", "lead", lead.id);
        return res.json({ lead });
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteLead(req, res, next) {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead)
            throw notFound("Lead not found");
        await lead.deleteOne();
        await recordAudit(req.user?.id ?? null, "lead.delete", "lead", lead.id);
        return res.json({ message: "Lead deleted" });
    }
    catch (error) {
        return next(error);
    }
}
