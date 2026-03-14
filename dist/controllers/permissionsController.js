import { Permission } from "../models/Permission.js";
import { getPagination } from "../utils/pagination.js";
export async function listPermissions(req, res) {
    const { page, limit, skip } = getPagination(req.query);
    const { q, module } = req.query;
    const filter = {};
    if (q)
        filter.$or = [{ key: new RegExp(q, "i") }, { label: new RegExp(q, "i") }];
    if (module)
        filter.module = module;
    const [items, total] = await Promise.all([
        Permission.find(filter).skip(skip).limit(limit).lean(),
        Permission.countDocuments(filter),
    ]);
    return res.json({ items, page, limit, total });
}
