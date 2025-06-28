const express = require("express")
const router = express.Router()
const horariosControllers = require("../controllers/horariosControllers")

router.get("/",horariosControllers.getHorarios)

router.get("/:id",horariosControllers.getHorario)

router.get("/horarios-disponibles",horariosControllers.getHorariosDisponibles)

router.post("/create",horariosControllers.createHorario)

router.patch("/update/:id",horariosControllers.updateHorario)

router.delete("/delete/:id",horariosControllers.deleteHorario)

module.exports = router