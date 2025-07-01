const express=require("express")
const router = express.Router()
const { getOneCancha, getHorariosCancha,postReserva,getReservas,deleteReservas,updateReserva} = require("../controllers/reservasController")


router.get("/misReservas",getReservas)

router.post("/",postReserva)

router.delete("/:id_reserva",deleteReservas)

router.get("/:id/turnos", getHorariosCancha)

router.get("/:id", getOneCancha)

router.patch("/update/:id",updateReserva)

module.exports= router