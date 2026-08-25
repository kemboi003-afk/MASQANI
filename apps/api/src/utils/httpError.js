export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new HttpError(400, message, details);
}

export function unauthorized(message = "Authentication required") {
  return new HttpError(401, message);
}

export function forbidden(message = "Access denied") {
  return new HttpError(403, message);
}

export function paymentRequired(message = "Active subscription required") {
  return new HttpError(402, message);
}

export function notFound(message = "Resource not found") {
  return new HttpError(404, message);
}
