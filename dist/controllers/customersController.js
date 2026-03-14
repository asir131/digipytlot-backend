import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { getPagination } from "../utils/pagination.js";
export async function listCustomers(req, res) {
    const { page, limit, skip } = getPagination(req.query);
    const { q } = req.query;
    const filter = {};
    if (q)
        filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];
    const customerRole = await Role.findOne({ name: "Customer" }).lean();
    if (customerRole)
        filter.roleIds = customerRole._id;
    const [items, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit).select("-passwordHash").lean(),
        User.countDocuments(filter),
    ]);
    const mapped = items.map((item) => ({ ...item, id: item._id }));
    return res.json({ items: mapped, page, limit, total });
}
