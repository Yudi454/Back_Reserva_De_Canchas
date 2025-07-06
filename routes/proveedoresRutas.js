const express = require("express")
const router = express.Router()
const proveedoresControllers = require("../controllers/proveedoresControllers")

router.get("/",proveedoresControllers.getProveedores)

router.get("/:id",proveedoresControllers.getProveedor)

router.post("/buscar",proveedoresControllers.buscarProveedorPorNombre)

router.post("/create",proveedoresControllers.createProveedor)

router.patch("/update/:id",proveedoresControllers.updateProveedor)

router.delete("/delete/:id",proveedoresControllers.deleteProveedor)

module.exports = router