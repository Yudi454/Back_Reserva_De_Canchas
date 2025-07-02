const express=require("express")
const router = express.Router()
const {getAllCanchas,getOneCancha,DeleteCancha, createCanchas,updateCanchas} = require("../controllers/canchas")


router.get("/",getAllCanchas);

router.get("/:id", getOneCancha)

router.patch("/:id_cancha",DeleteCancha);

router.post("/create",createCanchas);

router.patch("update/:id",updateCanchas)

module.exports= router