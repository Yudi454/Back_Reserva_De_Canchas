const express = require("express");
const router = express.Router();
const {
  getHorariosCancha,
  getOneReserva,
  getAllReservas,
  postReserva,
  getReservas,
  deleteReservas,
  updateReserva,
} = require("../controllers/reservasController");

router.get("/", getAllReservas);

router.get("/:id", getOneReserva);

router.get("/misReservas", getReservas);

router.post("/create", postReserva);

router.patch("/update/:id", updateReserva);

router.get("/:id/turnos", getHorariosCancha);

router.delete("/delete/:id", deleteReservas);

module.exports = router;
