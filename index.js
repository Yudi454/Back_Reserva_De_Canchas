const express = require("express");
const cors = require("cors");
const { conection } = require("./config/database");
const ventasRoutes = require("./routes/ventasRoutes")
require("dotenv").config();
const proveedoresRutas = require("./routes/proveedoresRutas")

const app = express();

app.use(cors());
app.use(express.json())

app.use("/ventas",ventasRoutes)

app.use(express.json())

app.use("/proveedores",proveedoresRutas)

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
