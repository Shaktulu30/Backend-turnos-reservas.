import { serviceService } from "../config/container.js";

export const getServices = async (req, res) => {
  const services = await serviceService.getAll();
  res.status(200).json({ status: "success", payload: services });
};

export const addService = async (req, res) => {
  const service = req.body;
  const resultado = await serviceService.create(service);
  if (resultado.error) {
    res.status(400).json({ status: "error", message: resultado.error });
  } else {
    req.app.get("io").emit("nuevoServicio", resultado);
    res.status(201).json({ status: "success", payload: resultado });
  }
};

export const getServiceById = async (req, res) => {
  const serviceId = req.params.sid;
  const service = await serviceService.getById(serviceId);
  if (service.error) {
    res.status(404).json({ status: "error", message: service.error });
  } else {
    res.status(200).json({ status: "success", payload: service });
  }
};

export const updateService = async (req, res) => {
  const serviceId = req.params.sid;
  const updatedService = req.body;
  const resultado = await serviceService.update(serviceId, updatedService);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
};

export const deleteService = async (req, res) => {
  const serviceId = req.params.sid;
  const resultado = await serviceService.delete(serviceId);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", message: "Servicio eliminado correctamente" });
  }
};