import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { badRequest } from "../utils/httpError.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadService = {
  createSignature() {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw badRequest("Cloudinary is not configured");
    }

    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp,
      folder: env.CLOUDINARY_UPLOAD_FOLDER,
      resource_type: "auto"
    };

    return {
      timestamp,
      signature: cloudinary.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET),
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      folder: env.CLOUDINARY_UPLOAD_FOLDER
    };
  }
};
