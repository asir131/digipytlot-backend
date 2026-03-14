import dotenv from "dotenv";
dotenv.config();
const required = ["MONGO_URI", "JWT_SECRET", "CORS_ORIGIN"];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing env var: ${key}`);
    }
}
export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 5000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
    corsOrigin: process.env.CORS_ORIGIN,
};
