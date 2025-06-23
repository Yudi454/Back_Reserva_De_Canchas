const { conection } = require("../config/database");

const getVentas = (req, res) => {
  const consulta =
    "SELECT id_venta,nombre_usuario,apellido_usuario,fecha_venta,total_venta FROM VENTAS V JOIN USUARIOS U ON V.ID_USUARIO = U.ID_USUARIO";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    const ventas = results.map((result) => ({
      id_venta: result.id_venta,
      nombre_usuario: `${result.nombre_usuario}-${result.apellido_usuario}`,
      fecha_venta: new Date(result.fecha_venta).toLocaleDateString("es-AR"),
      hora_venta: new Date(result.hora_venta).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      total_venta: result.total_venta,
    }));
    res.json(ventas);
  });
};

const getVenta = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT v.id_venta,v.fecha_venta,v.total_venta,u.nombre_usuario,u.apellido_usuario,u.telefono_usuario,p.nombre_producto,dv.cantidad,dv.subtotal_detalle_venta FROM VENTAS v JOIN USUARIOS u JOIN DETALLE_VENTAS dv JOIN PRODUCTOS p ON v.id_usuario = u.id_usuario AND v.id_venta = dv.id_venta and dv.id_producto = p.id_producto WHERE v.id_venta =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    let venta = {};
    if (venta.id_venta === undefined) {
      venta = {
        id_venta: results[0].id_venta,
        fecha_venta: new Date(results[0].fecha_venta).toLocaleDateString(
          "es-AR"
        ),
        hora_venta: new Date(results[0].fecha_venta).toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        ),
        nombre_usuario: `${results[0].nombre_usuario}-${results[0].apellido_usuario}`,
        telefono_usuario: results[0].telefono_usuario,
        productos: [],
      };
    }
    results.forEach((result) =>
      venta.productos.push({
        nombre_producto: result.nombre_producto,
        cantidad: result.cantidad,
        subtotal_detalle_venta: result.subtotal_detalle_venta,
      })
    );
    res.json(venta);
  });
};

const createVenta = (req, res) => {
  const { productos, ...ventaData } = req.body;

  let { id_usuario, fecha, hora, total } = ventaData;

  fecha = `${fecha} ${hora}:00`;

  const consulta =
    "INSERT INTO VENTAS (ID_USUARIO,FECHA_VENTA,TOTAL_VENTA) VALUES (?,?,?)";

  conection.query(consulta, [id_usuario, fecha, total], (err, results) => {
    if (err) throw err;
    const id_venta = results.insertId;
    productos.forEach((producto) => {
      const { id_producto, cantidad, subtotal } = producto;
      const consulta =
        "INSERT INTO DETALLE_VENTAS (ID_VENTA,ID_PRODUCTO,CANTIDAD,SUBTOTAL_DETALLE_VENTA) VALUES (?,?,?,?)";

      conection.query(
        consulta,
        [id_venta, id_producto, cantidad, subtotal],
        (err, results) => {
          if (err) throw err;
        }
      );
    });
    res.send({ message: "Venta creada con exito" });
  });
};

const updateVenta = (req, res) => {
  const { id } = req.params;

  const { productos, ...ventaData } = req.body;

  let { id_usuario, fecha, hora, total } = ventaData;

  fecha = `${fecha} ${hora}:00`;

  const consulta =
    "UPDATE VENTAS SET ID_USUARIO = ?,FECHA_VENTA = ?,TOTAL_VENTA= ? WHERE ID_VENTA = ?";

  conection.query(consulta, [id_usuario, fecha, total, id], (err, results) => {
    if (err) throw err;
    productos.forEach((producto) => {
      const { id_producto, cantidad, subtotal } = producto;

      const consulta =
        "UPDATE DETALLE_VENTAS SET ID_PRODUCTO = ?,CANTIDAD = ?,SUBTOTAL_DETALLE_VENTA = ? WHERE ID_VENTA = ?";

      conection.query(
        consulta,
        [id_producto, cantidad, subtotal, id],
        (err, results) => {
          if (err) throw err;
        }
      );
    });
    res.send({ message: "Venta actualizada con exito" });
  });
};

const deleteVenta = (req, res) => {
  const { id } = req.params;

  const consulta = "UPDATE VENTAS SET ESTADO_VENTA = FALSE WHERE ID_VENTA=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    const consulta =
      "UPDATE DETALLE_VENTAS SET ESTADO_DETALLE_VENTA = FALSE WHERE ID_VENTA=?";
    conection.query(consulta, [id], (err, results) => {
      if (err) throw err;
      res.send({ message: "Venta eliminada con exito" });
    });
  });
};

module.exports = {
  getVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
};
