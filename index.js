require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conection = require("./config/database");

const routerCanchas = require("./routes/canchas");
const routerReservas= require("./routes/reservas")
const productosRoutes = require("./routes/productosRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const usuariosRutas = require("./routes/usuariosRutas");
const proveedoresRutas = require("./routes/proveedoresRutas");
const routesClientes = require("./routes/clientes");
const authRutas = require("./routes/authRutas");
const horariosRutas = require("./routes/horariosRutas");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/canchas", routerCanchas);
app.use("/reservas",routerReservas)
app.use("/clientes", routesClientes);
app.use("/usuarios", usuariosRutas);
app.use("/ventas", ventasRoutes);
app.use("/proveedores", proveedoresRutas);
app.use("/productos", productosRoutes);
app.use("/horarios", horariosRutas);
app.use("/auth", authRutas);

const PORT = process.env.PORT || 8000;

conection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});


app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Conectado al puerto ${PORT}`);
});
