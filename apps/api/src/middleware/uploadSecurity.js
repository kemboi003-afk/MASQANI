import { badRequest } from "../utils/httpError.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime"
]);

export function assertAllowedUpload({ mimeType, sizeBytes }) {
  if (!allowedMimeTypes.has(mimeType)) {
    throw badRequest("Unsupported upload type");
  }

  if (sizeBytes > 75 * 1024 * 1024) {
    throw badRequest("Upload exceeds 75MB limit");
  }
}
