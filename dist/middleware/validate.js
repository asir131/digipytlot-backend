import { badRequest } from "../utils/errors.js";
export function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        if (!result.success) {
            return next(badRequest("Validation failed", result.error.flatten()));
        }
        Object.assign(req, result.data);
        return next();
    };
}
