const express = require("express")
const router = express.Router()
const ventasControllers = require("../controllers/ventasControllers")

router.get("/",ventasControllers.getVentas)

router.get("/:id",ventasControllers.getVenta)

router.post("/create",ventasControllers.createVenta);

router.patch("/update/:id",ventasControllers.updateVenta)

router.delete("/delete/:id",ventasControllers.deleteVenta)



module.exports = router