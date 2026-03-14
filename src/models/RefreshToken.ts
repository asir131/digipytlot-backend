import mongoose, { Schema } from "mongoose";

export type RefreshTokenDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  tokenId: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByTokenId?: string | null;
  userAgent?: string;
  ip?: string;
};

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenId: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    replacedByTokenId: { type: String, default: null },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

export const RefreshToken = mongoose.model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);
