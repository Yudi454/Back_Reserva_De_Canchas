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
  cargarReservas
} = require("../controllers/reservasController");

router.get("/", getAllReservas);

router.get("/:id", getOneReserva);

router.get("/misReservas/:id", getReservas);

router.post("/create", postReserva);

router.post("/cargarVentas/:id", cargarReservas)

router.patch("/update/:id", updateReserva);

router.get("/:id/turnos", getHorariosCancha);

router.delete("/delete/:id", deleteReservas);

module.exports = router;
