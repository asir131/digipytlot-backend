import mongoose, { Schema } from "mongoose";

export type TaskDocument = mongoose.Document & {
  title: string;
  status: "open" | "in_progress" | "done" | "blocked";
  assigneeId?: mongoose.Types.ObjectId | null;
  dueDate?: Date | null;
  priority: "low" | "medium" | "high";
};

const taskSchema = new Schema<TaskDocument>(
  {
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
  },
  { timestamps: true }
);

taskSchema.index({ assigneeId: 1, status: 1 });

taskSchema.index({ title: "text" });

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
