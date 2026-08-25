import { propertyService } from "../services/property.service.js";

export const propertyController = {
  async list(req, res) {
    const properties = await propertyService.list(req.validated.query);
    res.json({ properties });
  },

  async get(req, res) {
    const property = await propertyService.findById(req.validated.params.id);
    res.json({ property });
  },

  async mine(req, res) {
    const properties = await propertyService.listOwned(req.user.id);
    res.json({ properties });
  },

  async create(req, res) {
    const property = await propertyService.create(req.user.id, req.validated.body);
    res.status(201).json({
      property,
      subscription: req.subscription
    });
  },

  async update(req, res) {
    const property = await propertyService.update(req.user.id, req.validated.params.id, req.validated.body);
    res.json({ property });
  },

  async setStatus(req, res) {
    const property = await propertyService.setStatus(req.user.id, req.validated.params.id, req.validated.body.status);
    res.json({ property });
  },

  async remove(req, res) {
    await propertyService.softDelete(req.user.id, req.validated.params.id);
    res.status(204).send();
  }
};
