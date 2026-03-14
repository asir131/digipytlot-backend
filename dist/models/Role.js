import mongoose, { Schema } from "mongoose";
const roleSchema = new Schema({
    name: { type: String, required: true, unique: true, index: true },
    permissions: { type: [String], required: true, default: [] },
    description: { type: String },
}, { timestamps: true });
export const Role = mongoose.model("Role", roleSchema);
