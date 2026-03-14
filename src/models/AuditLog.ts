import mongoose, { Schema } from "mongoose";

export type AuditLogDocument = mongoose.Document & {
  actorId: mongoose.Types.ObjectId | null;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true, index: true },
    targetId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);
