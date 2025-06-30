const express=require("express")
const router = express.Router()
const {getAllCanchas,patchCancha, createCanchas,updateCanchas} = require("../controllers/canchas")


router.get("/",getAllCanchas);

router.patch("/:id_cancha",patchCancha);

router.post("/create",createCanchas);

router.patch("update/:id",updateCanchas)

module.exports= router