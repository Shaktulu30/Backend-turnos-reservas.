import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";

const router = Router();

const serviceManager = new ServiceManager();

router.get("/", async (req, res) => {
  const services = await serviceManager.getServices();
  res.status(200).json({ status: "success", payload: services });
});

router.post("/", async (req, res) => {
  const service = req.body;
  const resultado = await serviceManager.addService(service);
  if (resultado.error) {
    res.status(400).json({ status: "error", message: resultado.error });
  } else {
    res.status(201).json({ status: "success", payload: resultado });
  }
});

router.get("/:sid", async (req, res) => {
  const serviceId = Number(req.params.sid);
  const service = await serviceManager.getServiceById(serviceId);
  if (service.error) {
    res.status(404).json({ status: "error", message: service.error });
  } else {
    res.status(200).json({ status: "success", payload: service });
  }
});

router.put("/:sid", async (req, res) => {
  const serviceId = Number(req.params.sid);
  const updatedService = req.body;
  const resultado = await serviceManager.updateService(serviceId, updatedService);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
});

router.delete("/:sid", async (req, res) => {
  const serviceId = Number(req.params.sid);
  const resultado = await serviceManager.deleteService(serviceId);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "Servicio eliminado correctamente" });
  }
});

export default router;
