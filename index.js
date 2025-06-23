const express = require("express");
const cors = require("cors");
const { conection } = require("./config/database");
require("dotenv").config();
const authRutas = require("./routes/authRutas")

const app = express();

app.use(cors());

app.use(express.json())

app.use("/auth",authRutas)

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
