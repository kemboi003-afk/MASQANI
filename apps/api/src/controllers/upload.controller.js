import { uploadService } from "../services/upload.service.js";

export const uploadController = {
  async signature(req, res) {
    res.json(uploadService.createSignature());
  }
};
