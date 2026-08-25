import { HttpError } from "../utils/httpError.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      throw new HttpError(422, "Validation failed", result.error.flatten());
    }

    req.validated = result.data;
    next();
  };
}
