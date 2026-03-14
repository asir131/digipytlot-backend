import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    roleIds: [{ type: Schema.Types.ObjectId, ref: "Role", index: true }],
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ["active", "suspended", "banned"], default: "active" },
    managerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });
userSchema.index({ managerId: 1 });
export const User = mongoose.model("User", userSchema);
