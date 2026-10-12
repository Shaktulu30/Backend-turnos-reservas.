import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";

const router = Router();

const serviceManager = new ServiceManager();

router.get("/", (req, res) => {
  const services = serviceManager.getServices();
  res.status(200).json({ status: "success", payload: services });
});

router.post("/", (req, res) => {
  const service = req.body;
  const resultado = serviceManager.addService(service);
  if (resultado.error) {
    res.status(400).json({ status: "error", message: resultado.error });
  } else {
    res.status(201).json({ status: "success", payload: resultado });
  }
});

router.get("/:sid", (req, res) => {
  const serviceId = Number(req.params.sid);
  const service = serviceManager.getServiceById(serviceId);
  if (service.error) {
    res.status(404).json({ status: "error", message: service.error });
  } else {
    res.status(200).json({ status: "success", payload: service });
  }
});

router.put("/:sid", (req, res) => {
  const serviceId = Number(req.params.sid);
  const updatedService = req.body;
  const resultado = serviceManager.updateService(serviceId, updatedService);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
});

router.delete("/:sid", (req, res) => {
  const serviceId = Number(req.params.sid);
  const resultado = serviceManager.deleteService(serviceId);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "Servicio eliminado correctamente" });
  }
});

export default router;
