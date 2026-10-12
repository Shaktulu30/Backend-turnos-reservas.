import { Router } from "express";
import { BookingManager } from "../managers/BookingManager.js";

const router = Router();
const bookingManager = new BookingManager();


router.post("/", async (req, res) => {
  const booking = req.body;
  const resultado = await bookingManager.createBooking(booking);
  if (resultado.error) {
    res.status(400).json({ status: "error", message: resultado.error });
  } else {
    res.status(201).json({ status: "success", payload: resultado });
  }
});

router.get("/:bid", async (req, res) => {
  const bookingId = Number(req.params.bid);
  const booking = await bookingManager.getBookingById(bookingId);
  if (booking.error) {
    res.status(404).json({ status: "error", message: booking.error });
  } else {
    res.status(200).json({ status: "success", payload: booking });
  }
});

// 👇 POST /api/bookings/:bid/services/:sid → lo armás vos

router.post("/:bid/services/:sid", async (req, res) => {
    const bid = Number(req.params.bid);
    const sid = Number(req.params.sid);

    const resultado = await bookingManager.addServiceToBooking(bid, sid);

      if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
})

export default router;