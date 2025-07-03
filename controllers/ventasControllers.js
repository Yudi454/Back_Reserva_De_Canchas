const conection = require("../config/database");
const dayjs = require("dayjs");

const getVentas = (req, res) => {
  const consulta =
    "SELECT id_venta,nombre_usuario,apellido_usuario,fecha_venta,total_venta FROM VENTAS V JOIN USUARIOS U ON V.ID_USUARIO = U.ID_USUARIO WHERE ESTADO_VENTA = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    const ventas = results.map((result) => ({
      id_venta: result.id_venta,
      nombre_usuario: `${result.nombre_usuario}-${result.apellido_usuario}`,
      fecha_venta: new Date(result.fecha_venta).toLocaleDateString("es-AR"),
      hora_venta: new Date(result.fecha_venta).toLocaleTimeString("es-AR", {
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
    "SELECT v.id_venta,v.fecha_venta,v.total_venta, u.email_usuario, u.nombre_usuario,u.apellido_usuario,u.telefono_usuario,p.id_producto, p.nombre_producto, p.precio_producto,dv.cantidad,dv.subtotal_detalle_venta FROM VENTAS v JOIN USUARIOS u JOIN DETALLE_VENTAS dv JOIN PRODUCTOS p ON v.id_usuario = u.id_usuario AND v.id_venta = dv.id_venta and dv.id_producto = p.id_producto WHERE v.id_venta =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    let venta = {};
    venta = {
      id_venta: results[0].id_venta,
      fecha_venta: dayjs(results[0].fecha_venta).format("DD-MM-YYYY"),
      hora_venta: dayjs(results[0].fecha_venta).format("HH:mm"),
      nombre_usuario: `${results[0].nombre_usuario}-${results[0].apellido_usuario}`,
      email_usuario: results[0].email_usuario,
      telefono_usuario: results[0].telefono_usuario,
      total_venta: results[0].total_venta,
      productos: [],
    };

    results.forEach((result) =>
      venta.productos.push({
        id_producto: result.id_producto,
        nombre_producto: result.nombre_producto,
        cantidad: result.cantidad,
        subtotal_detalle_venta: result.subtotal_detalle_venta,
        precio_producto: result.precio_producto,
      })
    );

    if (venta.productos.length > 0) {
      res.json({ results: venta });
    }
  });
};

const createVenta = (req, res) => {
  const { productos, ...ventaData } = req.body;

  let { fecha_venta, hora_venta, total_venta, email_usuario } = ventaData;

  const consulta = "SELECT id_usuario FROM USUARIOS WHERE email_usuario = ?";

  conection.query(consulta, [email_usuario], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const id_usuario = result[0].id_usuario;

      let [dia, mes, año] = fecha_venta.split("-");
      fecha_venta = `${año}-${mes}-${dia}`;

      fecha = `${fecha_venta} ${hora_venta}:00`;

      const consulta =
        "INSERT INTO VENTAS (ID_USUARIO,FECHA_VENTA,TOTAL_VENTA) VALUES (?,?,?)";

      conection.query(
        consulta,
        [id_usuario, fecha, total_venta],
        (err, result) => {
          if (err) throw err;

          const id_venta = result.insertId;

          const consulta =
            "INSERT INTO DETALLE_VENTAS (ID_PRODUCTO,ID_VENTA,CANTIDAD,SUBTOTAL_DETALLE_VENTA) VALUES (?,?,?,?)";

          let contador = 0;

          productos.forEach((p) => {
            const { id_producto, precio_producto, cantidad } = p;

            const subtotal = precio_producto * cantidad;

            conection.query(
              consulta,
              [id_producto, id_venta, cantidad, subtotal],
              (err, result) => {
                if (err) throw err;
                contador++;
                if (contador === productos.length) {
                  res.status(201).send({ message: "Venta creada con exito" });
                }
              }
            );
          });
        }
      );
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  });
};

const cargarVentas = (req, res) => {
  const { id } = req.params;

  const productos = req.body;

  let total_venta = 0;

  productos.forEach((p) => {
    total_venta += p.total_venta;
  });

  const fechaFormateada = dayjs(new Date()).format("YYYY-MM-DD");

  let productosCargados = 0;

  const consulta =
    "INSERT INTO VENTAS (id_usuario,fecha_venta,total_venta) VALUES (?,?,?)";

  conection.query(
    consulta,
    [id, fechaFormateada, total_venta],
    (err, results) => {
      if (err) throw err;
      const id_venta = results.insertId;

      productos.map((p) => {
        const consulta =
          "INSERT INTO DETALLE_VENTAS (id_producto,id_venta,cantidad,subtotal_detalle_venta) VALUES (?,?,?,?)";

        conection.query(
          consulta,
          [p.id_producto, id_venta, p.cantidad, p.total_venta],
          (err, results) => {
            if (err) throw err;
            productosCargados++;
            if (productosCargados === productos.length) {
              res.send({ message: "Venta creada con exito" });
            }
          }
        );
      });
    }
  );
};

const updateVenta = (req, res) => {
  const { id } = req.params;
  const { productos, ...ventaData } = req.body;

  let { fecha_venta, hora_venta, total_venta, email_usuario } = ventaData;

  const consulta = "SELECT id_usuario FROM USUARIOS WHERE email_usuario = ?";

  conection.query(consulta, [email_usuario], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const id_usuario = result[0].id_usuario;

      let [dia, mes, año] = fecha_venta.split("-");
      fecha_venta = `${año}-${mes}-${dia}`;

      fecha = `${fecha_venta} ${hora_venta}:00`;

      const consulta =
        "UPDATE VENTAS SET id_usuario = ?, fecha_venta = ?, total_venta = ? where id_venta = ?";

      conection.query(
        consulta,
        [id_usuario, fecha, total_venta, id],
        (err, result) => {
          if (err) throw err;
          let contador = 0;
          if (result.length > 0) {
            const consulta =
              "UPDATE DETALLE_VENTAS SET SUBTOTAL_DETALLE_VENTA = ?, CANTIDAD = ? WHERE id_producto = ?";

            productos.forEach((p) => {
              const { precio_producto, cantidad, id_producto } = p;

              const subtotal = precio_producto * cantidad;

              conection.query(
                consulta,
                [id_producto, id, subtotal, cantidad],
                (err, result) => {
                  if (err) throw err;

                  contador++;
                  if (contador === productos.length) {
                    res
                      .status(201)
                      .send({ message: "Venta actualizada con exito" });
                  }
                }
              );
            });
          } else {
            const consulta =
              "INSERT INTO DETALLE_VENTAS (ID_PRODUCTO,ID_VENTA,CANTIDAD,SUBTOTAL_DETALLE_VENTA) VALUES (?,?,?,?)";

            productos.forEach((p) => {
              const { id_producto, precio_producto, cantidad } = p;

              const subtotal = precio_producto * cantidad;

              conection.query(
                consulta,
                [id_producto, id, cantidad, subtotal],
                (err, result) => {
                  if (err) throw err;
                  contador++;
                  if (contador === productos.length) {
                    res
                      .status(201)
                      .send({ message: "Venta actualizada con exito" });
                  }
                }
              );
            });
          }
        }
      );
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
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
  cargarVentas,
};
