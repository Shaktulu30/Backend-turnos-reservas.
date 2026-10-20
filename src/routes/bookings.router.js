import { Router } from "express";
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
  updateServiceQuantity,
  removeServiceFromBooking,
  deleteBooking,
} from "../controllers/bookings.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  bookingCreateSchema,
  bookingAddServiceSchema,
  bookingUpdateQuantitySchema,
} from "../validations/booking.validation.js";

const router = Router();

router.post("/", validateBody(bookingCreateSchema), createBooking);
router.get("/:bid", getBookingById);
router.post(
  "/:bid/services/:sid",
  validateBody(bookingAddServiceSchema),
  addServiceToBooking,
);
router.put(
  "/:bid/services/:sid",
  validateBody(bookingUpdateQuantitySchema),
  updateServiceQuantity,
);
router.delete("/:bid/services/:sid", removeServiceFromBooking);
router.delete("/:bid", deleteBooking);

export default router;
