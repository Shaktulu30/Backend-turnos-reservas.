import { Router } from "express";
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  bookingCreateSchema,
  bookingAddServiceSchema,
} from "../validations/booking.validation.js";

const router = Router();

router.post("/", validateBody(bookingCreateSchema), createBooking);
router.get("/:bid", getBookingById);
router.post("/:bid/services/:sid", validateBody(bookingAddServiceSchema), addServiceToBooking);

export default router;