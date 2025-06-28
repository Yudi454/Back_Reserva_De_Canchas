require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conection  = require("./config/database");
const routerCanchas = require("./routes/canchas")


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

//rutas de canchas y misReservas
app.use("/canchas",routerCanchas)

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
