const express = require("express")
const router = express.Router()
const proveedoresControllers = require("../controllers/proveedoresControllers")

router.get("/",proveedoresControllers.getProveedores)

router.get("/:id",proveedoresControllers.getProveedor)

router.post("/create",proveedoresControllers.createProveedor)

router.put("update",proveedoresControllers.updateProveedor)

router.put("/delete",proveedoresControllers.deleteProveedor)

module.exports = router