const express = require("express");
const cors = require("cors");
const { conection } = require("./config/database");
const productosRoutes = require("./routes/productosRoutes")
const ventasRoutes = require("./routes/ventasRoutes")
const usuariosRutas = require("./routes/usuariosRutas")
const proveedoresRutas = require("./routes/proveedoresRutas")
require("dotenv").config();

const app = express();

app.use(express.json())
app.use(cors());

app.use("/usuarios",usuariosRutas)
app.use("/ventas",ventasRoutes)
app.use("/proveedores",proveedoresRutas)
app.use("/productos",productosRoutes)

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
