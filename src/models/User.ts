import mongoose, { Schema } from "mongoose";

export type UserStatus = "active" | "suspended" | "banned";

export type UserDocument = mongoose.Document & {
  name: string;
  email: string;
  passwordHash: string;
  roleIds: mongoose.Types.ObjectId[];
  permissions: string[];
  status: UserStatus;
  managerId?: mongoose.Types.ObjectId | null;
  tokenVersion: number;
};

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    roleIds: [{ type: Schema.Types.ObjectId, ref: "Role", index: true }],
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ["active", "suspended", "banned"], default: "active" },
    managerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ managerId: 1 });

export const User = mongoose.model<UserDocument>("User", userSchema);
