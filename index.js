const express = require("express");
const cors = require("cors");
const { conection } = require("./config/database");
require("dotenv").config();
const usuariosRutas = require("./routes/usuariosRutas")

const app = express();

app.use(cors());

app.use(express.json())

app.use("/usuarios",usuariosRutas)

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
