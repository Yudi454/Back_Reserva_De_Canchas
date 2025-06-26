const express = require("express");
const cors = require("cors");
const { conection } = require("./config/database");
require("dotenv").config();
const routerCanchas = require("./routes/canchas")

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

//rutas de canchas y misReservas
app.use("/",routerCanchas)

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
