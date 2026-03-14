import mongoose, { Schema } from "mongoose";
const permissionSchema = new Schema({
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    module: { type: String, required: true, index: true },
    description: { type: String },
}, { timestamps: true });
export const Permission = mongoose.model("Permission", permissionSchema);
