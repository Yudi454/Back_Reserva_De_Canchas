const express=require("express")
const router = express.Router()
const {getAllCanchas, getOneCancha, getHorariosCancha,postReserva,getReservas,deleteReservas} = require("../controllers/canchas")


router.get("/",getAllCanchas);

router.get("/misReservas",getReservas)

router.post("/reservas",postReserva)

router.delete("/reservas/:id_reserva",deleteReservas)

router.get("/:id/turnos", getHorariosCancha)

router.get("/:id", getOneCancha)


module.exports= router