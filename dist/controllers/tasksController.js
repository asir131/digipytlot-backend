import { Task } from "../models/Task.js";
import { getPagination } from "../utils/pagination.js";
import { recordAudit } from "../services/auditService.js";
import { notFound } from "../utils/errors.js";
export async function listTasks(req, res) {
    const { page, limit, skip } = getPagination(req.query);
    const { q, status, assigneeId } = req.query;
    const filter = {};
    if (q)
        filter.$text = { $search: q };
    if (status)
        filter.status = status;
    if (assigneeId)
        filter.assigneeId = assigneeId;
    const [items, total] = await Promise.all([
        Task.find(filter).skip(skip).limit(limit).lean(),
        Task.countDocuments(filter),
    ]);
    return res.json({ items, page, limit, total });
}
export async function createTask(req, res, next) {
    try {
        const task = await Task.create(req.body);
        await recordAudit(req.user?.id ?? null, "task.create", "task", task.id);
        return res.status(201).json({ task });
    }
    catch (error) {
        return next(error);
    }
}
export async function updateTask(req, res, next) {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task)
            throw notFound("Task not found");
        await recordAudit(req.user?.id ?? null, "task.update", "task", task.id);
        return res.json({ task });
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            throw notFound("Task not found");
        await task.deleteOne();
        await recordAudit(req.user?.id ?? null, "task.delete", "task", task.id);
        return res.json({ message: "Task deleted" });
    }
    catch (error) {
        return next(error);
    }
}
