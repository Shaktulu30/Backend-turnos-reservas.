import { Router } from "express";
import {
  getServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { serviceCreateSchema, serviceUpdateSchema } from "../validations/service.validation.js";

const router = Router();

router.get("/", getServices);
router.post("/", validateBody(serviceCreateSchema), addService);
router.get("/:sid", getServiceById);
router.put("/:sid", validateBody(serviceUpdateSchema), updateService);
router.delete("/:sid", deleteService);

export default router;
