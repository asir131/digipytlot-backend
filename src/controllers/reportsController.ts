import { Request, Response } from "express";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

export async function getReports(_req: Request, res: Response) {
  const [leadCount, taskCount, userCount] = await Promise.all([
    Lead.countDocuments(),
    Task.countDocuments(),
    User.countDocuments(),
  ]);

  return res.json({
    stats: {
      leads: leadCount,
      tasks: taskCount,
      users: userCount,
    },
  });
}
