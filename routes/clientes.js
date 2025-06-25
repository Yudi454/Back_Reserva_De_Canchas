const express = require("express")
const { getAllClientes, deleteClientes, updateClientes, createCliente } = require("../controllers/clientes")

const router = express.Router()

router.get("/clientes",getAllClientes)

router.delete("/cliente/delete/:id",deleteClientes)

router.put("/cliente/update/:id",updateClientes)

router.post("/cliente/create",createCliente)

module.exports = router