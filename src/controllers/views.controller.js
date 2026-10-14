import { serviceService } from "../config/container.js";

export const renderServices = async (req, res) => {
  const services = await serviceService.getAll();
  res.render('services', { services });
};

export const renderAvailability = async (req, res) => {
  const all = await serviceService.getAll();
  const services = all.filter(s => s.available);
  res.render('availability', { services });
};