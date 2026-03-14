import mongoose, { Schema } from "mongoose";
const auditLogSchema = new Schema({
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true, index: true },
    targetId: { type: String },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });
auditLogSchema.index({ createdAt: -1 });
export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
