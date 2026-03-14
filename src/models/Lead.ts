import mongoose, { Schema } from "mongoose";

export type LeadDocument = mongoose.Document & {
  title: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  ownerId?: mongoose.Types.ObjectId | null;
  customerId?: mongoose.Types.ObjectId | null;
  value?: number;
  tags?: string[];
};

const leadSchema = new Schema<LeadDocument>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "won", "lost"],
      default: "new",
      index: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    customerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    value: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

leadSchema.index({ ownerId: 1, status: 1 });
leadSchema.index({ title: "text" });

export const Lead = mongoose.model<LeadDocument>("Lead", leadSchema);
