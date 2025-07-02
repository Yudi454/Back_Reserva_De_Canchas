const express=require("express")
const router = express.Router()
const {getHorariosCancha,getOneReserva,getAllReservas,postReserva,getReservas,deleteReservas,updateReserva} = require("../controllers/reservasController")


router.get("/misReservas",getReservas)

router.get("//misReservas/:id",getOneReserva)

router.get("/",getAllReservas)

router.post("/create",postReserva)

router.delete("/:id_reserva",deleteReservas)

router.get("/:id/turnos", getHorariosCancha)

router.patch("/update/:id",updateReserva)

module.exports= router