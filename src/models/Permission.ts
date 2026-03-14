import mongoose, { Schema } from "mongoose";

export type PermissionDocument = mongoose.Document & {
  key: string;
  label: string;
  module: string;
  description?: string;
};

const permissionSchema = new Schema<PermissionDocument>(
  {
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    module: { type: String, required: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Permission = mongoose.model<PermissionDocument>("Permission", permissionSchema);
