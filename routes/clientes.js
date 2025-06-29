const express = require("express")
const { getAllClientes, deleteClientes, updateClientes, createCliente, getCliente } = require("../controllers/clientes")

const router = express.Router()

router.get("/",getAllClientes)

router.get("/:id",getCliente)

router.delete("/delete/:id",deleteClientes)

router.patch("/update/:id",updateClientes)

router.post("/create",createCliente)

module.exports = router