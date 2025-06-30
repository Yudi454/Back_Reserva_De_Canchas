const express=require("express")
const router = express.Router()
const { getOneCancha, getHorariosCancha,postReserva,getReservas,deleteReservas} = require("../controllers/reservasController")


router.get("/misReservas",getReservas)

router.post("/",postReserva)

router.delete("/:id_reserva",deleteReservas)

router.get("/:id/turnos", getHorariosCancha)

router.get("/:id", getOneCancha)

module.exports= router