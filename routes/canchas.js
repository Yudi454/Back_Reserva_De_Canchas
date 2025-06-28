const express=require("express")
const router = express.Router()
const {getAllCanchas, getOneCancha, getHorariosCancha,postReserva,getReservas,deleteReservas} = require("../controllers/canchas")


router.get("/",getAllCanchas);

router.get("/:id", getOneCancha)

router.get("/:id/turnos", getHorariosCancha)

router.post("/reservas",postReserva)

router.get("/misReservas",getReservas)

router.delete("/reservas/:id_reserva",deleteReservas)


module.exports= router