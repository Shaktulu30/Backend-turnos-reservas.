import { Router } from "express";
import {
  getServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";

const router = Router();

router.get("/", getServices);
router.post("/", addService);
router.get("/:sid", getServiceById);
router.put("/:sid", updateService);
router.delete("/:sid", deleteService);

export default router;