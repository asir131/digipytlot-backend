import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema({
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ["open", "in_progress", "done", "blocked"],
        default: "open",
        index: true,
    },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
}, { timestamps: true });
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ title: "text" });
export const Task = mongoose.model("Task", taskSchema);
