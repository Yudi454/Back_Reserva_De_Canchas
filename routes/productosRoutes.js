const express = require("express")
const router = express.Router();
const productosController = require("../controllers/productosController")

router.get("/",productosController.getProductos)

router.get("/:id",productosController.getProducto)

router.post("/create",productosController.createProducto)

router.put("/update/:id",productosController.updateProducto)

router.patch("/delete/:id",productosController.deleteProducto)

module.exports = router