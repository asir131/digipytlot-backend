import mongoose, { Schema } from "mongoose";

export type RoleDocument = mongoose.Document & {
  name: "Admin" | "Manager" | "Agent" | "Customer";
  permissions: string[];
  description?: string;
};

const roleSchema = new Schema<RoleDocument>(
  {
    name: { type: String, required: true, unique: true, index: true },
    permissions: { type: [String], required: true, default: [] },
    description: { type: String },
  },
  { timestamps: true }
);

export const Role = mongoose.model<RoleDocument>("Role", roleSchema);
