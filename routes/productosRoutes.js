const express = require("express")
const router = express.Router();
const productosController = require("../controllers/productosController")

router.get("/",productosController.getProductos)

router.get("/:id",productosController.getProducto)

router.post("/create",productosController.createProducto)

router.patch("/update/:id",productosController.updateProducto)

router.delete("/delete/:id",productosController.deleteProducto)

module.exports = router