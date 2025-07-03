const express = require("express");
const router = express.Router();
const {
  getAllCanchas,
  getOneCancha,
  DeleteCancha,
  createCanchas,
  updateCanchas,
} = require("../controllers/canchas");

router.get("/", getAllCanchas);

router.get("/:id", getOneCancha);

router.patch("/update/:id", updateCanchas);

router.post("/create", createCanchas);

router.delete("/delete/:id_cancha", DeleteCancha);

module.exports = router;
