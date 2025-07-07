const conection = require("../config/database");
const dayjs = require("dayjs");

const getVentas = (req, res) => {
  const consulta =
    "SELECT v.id_venta, u.nombre_usuario, u.apellido_usuario, v.fecha_venta, v.total_venta FROM VENTAS V JOIN USUARIOS U ON V.ID_USUARIO = U.ID_USUARIO WHERE ESTADO_VENTA = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener las ventas" });
    }

    const ventas = results.map((result) => ({
      id_venta: result.id_venta,
      nombre_usuario: `${result.nombre_usuario}-${result.apellido_usuario}`,
      fecha_venta: dayjs(result.fecha_venta).format("DD-MM-YYYY"),
      hora_venta: dayjs(result.fecha_venta).format("HH:mm"),
      total_venta: result.total_venta,
    }));

    return res.json(ventas);
  });
};

const getVenta = (req, res) => {
  const { id } = req.params;

  const consulta = `
    SELECT 
      v.id_venta, v.fecha_venta, v.total_venta, 
      u.email_usuario, u.nombre_usuario, u.apellido_usuario, u.telefono_usuario, 
      p.id_producto, p.imagen_producto, p.nombre_producto, p.precio_producto, 
      dv.cantidad, dv.subtotal_detalle_venta 
    FROM VENTAS v 
    JOIN USUARIOS u ON v.id_usuario = u.id_usuario
    JOIN DETALLE_VENTAS dv ON v.id_venta = dv.id_venta
    JOIN PRODUCTOS p ON dv.id_producto = p.id_producto 
    WHERE v.id_venta = ?
  `;

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener la venta" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const venta = {
      id_venta: results[0].id_venta,
      fecha_venta: dayjs(results[0].fecha_venta).format("DD-MM-YYYY"),
      hora_venta: dayjs(results[0].fecha_venta).format("HH:mm"),
      nombre_usuario: `${results[0].nombre_usuario}-${results[0].apellido_usuario}`,
      email_usuario: results[0].email_usuario,
      telefono_usuario: results[0].telefono_usuario,
      total_venta: results[0].total_venta,
      productos: results.map((r) => ({
        id_producto: r.id_producto,
        nombre_producto: r.nombre_producto,
        cantidad: r.cantidad,
        subtotal_detalle_venta: r.subtotal_detalle_venta,
        precio_producto: r.precio_producto,
        imagen: r.imagen_producto,
      })),
    };

    return res.json({ results: venta });
  });
};

const createVenta = (req, res) => {
  const { productos, ...ventaData } = req.body;

  let { fecha_venta, hora_venta, total_venta, email_usuario } = ventaData;

  const consultaUsuario =
    "SELECT id_usuario FROM USUARIOS WHERE email_usuario = ?";

  conection.query(consultaUsuario, [email_usuario], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar el usuario" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const id_usuario = result[0].id_usuario;

    let [dia, mes, año] = fecha_venta.split("-");
    fecha_venta = `${año}-${mes}-${dia}`;
    const fechaCompleta = `${fecha_venta} ${hora_venta}:00`;

    const consultaVenta =
      "INSERT INTO VENTAS (ID_USUARIO, FECHA_VENTA, TOTAL_VENTA) VALUES (?, ?, ?)";

    conection.query(
      consultaVenta,
      [id_usuario, fechaCompleta, total_venta],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al registrar la venta" });
        }

        const id_venta = result.insertId;

        const consultaDetalle =
          "INSERT INTO DETALLE_VENTAS (ID_PRODUCTO, ID_VENTA, CANTIDAD, SUBTOTAL_DETALLE_VENTA) VALUES (?, ?, ?, ?)";

        let contador = 0;
        let errorOcurrido = false;

        productos.forEach((p) => {
          const { id_producto, precio_producto, cantidad } = p;
          const subtotal = precio_producto * cantidad;

          conection.query(
            consultaDetalle,
            [id_producto, id_venta, cantidad, subtotal],
            (err) => {
              if (err) {
                errorOcurrido = true;
                return res.status(500).json({
                  message: "Error al registrar el detalle de la venta",
                });
              }

              contador++;

              if (contador === productos.length && !errorOcurrido) {
                return res
                  .status(201)
                  .json({ message: "Venta creada con éxito" });
              }
            }
          );
        });
      }
    );
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

  const consultaVenta =
    "INSERT INTO VENTAS (id_usuario, fecha_venta, total_venta) VALUES (?, ?, ?)";

  conection.query(
    consultaVenta,
    [id, fechaFormateada, total_venta],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al crear la venta" });
      }

      const id_venta = result.insertId;

      const consultaDetalle =
        "INSERT INTO DETALLE_VENTAS (id_producto, id_venta, cantidad, subtotal_detalle_venta) VALUES (?, ?, ?, ?)";
      let productosCargados = 0;
      let errorOcurrido = false;

      productos.forEach((p) => {
        conection.query(
          consultaDetalle,
          [p.id_producto, id_venta, p.cantidad, p.total_venta],
          (err) => {
            if (err) {
              errorOcurrido = true;
              return res
                .status(500)
                .json({ message: "Error al insertar detalle de venta" });
            }

            productosCargados++;

            if (productosCargados === productos.length && !errorOcurrido) {
              return res
                .status(201)
                .json({ message: "Venta creada con éxito" });
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

  const consultaUsuario =
    "SELECT id_usuario FROM USUARIOS WHERE email_usuario = ?";

  conection.query(consultaUsuario, [email_usuario], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar el usuario" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const id_usuario = result[0].id_usuario;
    const [dia, mes, año] = fecha_venta.split("-");
    const fecha_formateada = `${año}-${mes}-${dia} ${hora_venta}:00`;

    const consultaVenta =
      "UPDATE VENTAS SET id_usuario = ?, fecha_venta = ?, total_venta = ? WHERE id_venta = ?";

    conection.query(
      consultaVenta,
      [id_usuario, fecha_formateada, total_venta, id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error al actualizar venta" });
        }

        const consultaDetalle =
          "UPDATE DETALLE_VENTAS SET SUBTOTAL_DETALLE_VENTA = ?, CANTIDAD = ? WHERE id_producto = ? AND id_venta = ?";

        let contador = 0;
        let errorOcurrido = false;

        productos.forEach((p) => {
          const { precio_producto, cantidad, id_producto } = p;
          const subtotal = precio_producto * cantidad;

          conection.query(
            consultaDetalle,
            [subtotal, cantidad, id_producto, id],
            (err, result) => {
              if (err) {
                errorOcurrido = true;
                return res
                  .status(500)
                  .json({ message: "Error al actualizar detalle de venta" });
              }

              contador++;
              if (contador === productos.length && !errorOcurrido) {
                return res
                  .status(200)
                  .json({ message: "Venta actualizada con éxito" });
              }
            }
          );
        });
      }
    );
  });
};

const deleteVenta = (req, res) => {
  const { id } = req.params;

  const consultaVenta =
    "UPDATE VENTAS SET ESTADO_VENTA = FALSE WHERE ID_VENTA=?";

  conection.query(consultaVenta, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar venta" });
    }

    const consultaDetalle =
      "UPDATE DETALLE_VENTAS SET ESTADO_DETALLE_VENTA = FALSE WHERE ID_VENTA=?";

    conection.query(consultaDetalle, [id], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al eliminar los detalles de la venta" });
      }

      return res.status(200).json({ message: "Venta eliminada con éxito" });
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
