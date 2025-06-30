const express=require("express")
const router = express.Router()
const {getAllCanchas} = require("../controllers/canchas")


router.get("/",getAllCanchas);


module.exports= router