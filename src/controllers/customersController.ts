import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { getPagination } from "../utils/pagination.js";

export async function listCustomers(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query as Record<string, string>);
  const { q } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];

  const customerRole = await Role.findOne({ name: "Customer" }).lean();
  if (customerRole) filter.roleIds = customerRole._id;

  const [items, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).select("-passwordHash").lean(),
    User.countDocuments(filter),
  ]);

  const mapped = items.map((item) => ({ ...item, id: item._id }));

  return res.json({ items: mapped, page, limit, total });
}
