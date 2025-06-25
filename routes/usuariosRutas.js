const express = require("express")
const router = express.Router()
const usuariosControllers = require("../controllers/usuariosControllers")

router.get("/",usuariosControllers.getUsuarios)

router.get("/:id",usuariosControllers.getUsuario)

router.post("/create",usuariosControllers.createUsuario)

router.put("/update",usuariosControllers.updateUsuario)

router.put("/delete",usuariosControllers.deleteUsuario)

module.exports = router