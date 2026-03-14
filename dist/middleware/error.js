import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, details: err.details });
    }
    logger.error("Unhandled error", err);
    return res.status(500).json({ message: "Internal server error" });
}
