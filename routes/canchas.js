const express=require("express")
const router = express.Router()
const {getAllCanchas, getOneCancha, getHorariosCancha,postReserva,getReservas} = require("../controllers/canchas")


router.get("/canchas",getAllCanchas);
router.get("/canchas/InfoCancha/:id", getOneCancha)
router.get("/canchas/InfoCancha/:id/turnos", getHorariosCancha)
router.post("/canchas/reservas",postReserva)
router.get("/canchas/misReservas",getReservas)


module.exports= router