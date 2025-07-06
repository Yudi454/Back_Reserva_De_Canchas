const dayjs = require("dayjs");
const conection = require("../config/database.js");

const getHorariosCancha = (req, res) => {
  const { id } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: "Debe proporcionar una fecha" });
  }

  const consulta = `
    SELECT h.id_horario, h.hora_inicio, h.hora_fin
    FROM Horarios h
    WHERE h.estado_horario = TRUE AND h.id_horario NOT IN (
      SELECT dr.id_horario
      FROM Detalle_Reservas dr
      JOIN Reservas r ON dr.id_reserva = r.id_reserva
      WHERE dr.id_cancha = ? AND r.dia_reserva = ?
    )
  `;

  conection.query(consulta, [id, fecha], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No hay horarios disponibles" });
    }

    return res.status(200).json(results);
  });
};

const getOneReserva = (req, res) => {
  const { id } = req.params;

  const consulta = `
    SELECT r.id_reserva, cl.usuario, cl.email_cliente, cl.telefono_cliente, r.total, r.dia_reserva,
           h.hora_inicio, h.hora_fin, ca.id_cancha, ca.imagen_cancha, ca.tipo_cancha, ca.precio_cancha
    FROM RESERVAS r
    JOIN CLIENTES cl ON r.id_cliente = cl.id_cliente
    JOIN DETALLE_RESERVAS dv ON dv.id_reserva = r.id_reserva
    JOIN CANCHAS ca ON dv.id_cancha = ca.id_cancha
    JOIN HORARIOS h ON dv.id_horario = h.id_horario
    WHERE r.id_reserva = ?
  `;

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al traer la reserva" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "La reserva no existe" });
    }

    const data = results[0];

    return res.status(200).json({
      results: {
        id_reserva: data.id_reserva,
        usuario: data.usuario,
        email_cliente: data.email_cliente,
        telefono_cliente: data.telefono_cliente,
        total_reserva: data.total,
        dia_reserva: dayjs(data.dia_reserva).format("DD-MM-YYYY"),
        horario: `${data.hora_inicio}-${data.hora_fin}`,
        id_cancha: data.id_cancha,
        tipo_cancha: data.tipo_cancha,
        precio_cancha: data.precio_cancha,
        imagen: data.imagen_cancha,
      },
    });
  });
};

const getAllReservas = (req, res) => {
  const consulta = `
    SELECT r.id_reserva, c.usuario, r.total, dia_reserva, h.hora_inicio, h.hora_fin
    FROM RESERVAS r
    JOIN CLIENTES c ON r.id_cliente = c.id_cliente
    JOIN DETALLE_RESERVAS dv ON r.id_reserva = dv.id_reserva
    JOIN HORARIOS h ON dv.id_horario = h.id_horario
    WHERE estado_detalle_reserva = true
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar reservas" });
    }

    const reservasFormateadas = results.map((r) => ({
      ...r,
      dia_reserva: dayjs(r.dia_reserva).format("DD-MM-YYYY"),
    }));

    res.status(200).json(reservasFormateadas);
  });
};

const getReservas = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Falta el id del usuario" });
  }

  const consulta = `
    SELECT 
      r.id_reserva,
      r.dia_reserva,
      c.tipo_cancha,
      c.precio_cancha,
      h.hora_inicio,
      h.hora_fin
    FROM Reservas r
    JOIN Detalle_Reservas dr ON r.id_reserva = dr.id_reserva
    JOIN Canchas c ON dr.id_cancha = c.id_cancha
    JOIN Horarios h ON dr.id_horario = h.id_horario
    WHERE r.id_cliente = ? AND dr.estado_detalle_reserva = 1
  `;

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al buscar reservas del cliente" });
    }

    if (results.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(results);
  });
};

const postReserva = (req, res) => {
  const { fecha_reserva, email_cliente, id_cancha, id_horario } = req.body;

  const fecha = dayjs(fecha_reserva, "D-M-YYYY").format("YYYY-MM-DD");

  const consultaCliente =
    "SELECT id_cliente FROM clientes WHERE email_cliente = ?";

  conection.query(consultaCliente, [email_cliente], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar cliente" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const id_cliente = results[0].id_cliente;

    const consultaHorario =
      "SELECT hora_inicio, hora_fin FROM HORARIOS WHERE id_horario = ?";

    conection.query(consultaHorario, [id_horario], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al buscar horario" });
      }

      const data = results[0];
      const inicio = dayjs(`1970-01-01T${data.hora_inicio}`);
      const fin = dayjs(`1970-01-01T${data.hora_fin}`);
      const diferencia = fin.diff(inicio, "hour");

      const consultaCancha =
        "SELECT precio_cancha FROM CANCHAS WHERE id_cancha = ?";

      conection.query(consultaCancha, [id_cancha], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error al buscar cancha" });
        }

        const precio = results[0].precio_cancha;
        const total = diferencia * precio;

        const consultaInsertReserva =
          "INSERT INTO RESERVAS (ID_CLIENTE, TOTAL, DIA_RESERVA) VALUES (?, ?, ?)";

        conection.query(
          consultaInsertReserva,
          [id_cliente, total, fecha],
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error al crear reserva" });
            }

            const id_reserva = results.insertId;

            const consultaDetalle =
              "INSERT INTO DETALLE_RESERVAS (ID_RESERVA, ID_HORARIO, ID_CANCHA) VALUES (?, ?, ?)";

            conection.query(
              consultaDetalle,
              [id_reserva, id_horario, id_cancha],
              (err, results) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Error al crear detalle de reserva" });
                }
                res
                  .status(201)
                  .json({ message: "Reserva realizada con éxito" });
              }
            );
          }
        );
      });
    });
  });
};

const cargarReservas = (req, res) => {
  const { id } = req.params;
  const reservas = req.body;

  const consultaHorario =
    "SELECT hora_inicio,hora_fin FROM HORARIOS WHERE id_horario = ?";
  const consultaPrecioCancha =
    "SELECT precio_cancha FROM CANCHAS WHERE id_cancha = ?";
  const consultaInsertReserva =
    "INSERT INTO RESERVAS (id_cliente, total, dia_reserva) VALUES (?,?,?)";
  const consultaInsertDetalle =
    "INSERT INTO DETALLE_RESERVAS (id_reserva, id_horario,id_cancha) VALUES (?,?,?)";

  let procesadas = 0;
  let errorOcurrido = false;

  if (reservas.length === 0) {
    return res
      .status(400)
      .json({ message: "No se recibieron reservas para procesar" });
  }

  reservas.forEach((r) => {
    if (errorOcurrido) return;

    const { fecha_reserva, id_horario, id_cancha } = r;

    conection.query(consultaHorario, [id_horario], (err, results) => {
      if (err) {
        errorOcurrido = true;
        return res.status(500).json({ message: "Error al obtener horario" });
      }

      if (results.length === 0) {
        errorOcurrido = true;
        return res
          .status(404)
          .json({ message: `Horario con id ${id_horario} no encontrado` });
      }

      const { hora_inicio, hora_fin } = results[0];
      const inicio = dayjs(`1970-01-01T${hora_inicio}`);
      const fin = dayjs(`1970-01-01T${hora_fin}`);
      const duracion = fin.diff(inicio, "hour");

      conection.query(consultaPrecioCancha, [id_cancha], (err, results) => {
        if (err) {
          errorOcurrido = true;
          return res
            .status(500)
            .json({ message: "Error al obtener precio cancha" });
        }

        if (results.length === 0) {
          errorOcurrido = true;
          return res
            .status(404)
            .json({ message: `Cancha con id ${id_cancha} no encontrada` });
        }

        const precio = results[0].precio_cancha;
        const total = duracion * precio;

        conection.query(
          consultaInsertReserva,
          [id, total, fecha_reserva],
          (err, results) => {
            if (err) {
              errorOcurrido = true;
              return res
                .status(500)
                .json({ message: "Error al crear reserva" });
            }

            const id_reserva = results.insertId;

            conection.query(
              consultaInsertDetalle,
              [id_reserva, id_horario, id_cancha],
              (err) => {
                if (err) {
                  errorOcurrido = true;
                  return res
                    .status(500)
                    .json({ message: "Error al crear detalle de reserva" });
                }

                procesadas++;
                if (procesadas === reservas.length && !errorOcurrido) {
                  return res
                    .status(201)
                    .json({ message: "Reservas realizadas con éxito" });
                }
              }
            );
          }
        );
      });
    });
  });
};

const deleteReservas = (req, res) => {
  const { id } = req.params;

  const consultaDetalle =
    "UPDATE detalle_reservas SET estado_detalle_reserva = FALSE WHERE id_reserva = ?";

  conection.query(consultaDetalle, [id], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al eliminar el detalle de la reserva" });
    }

    const consultaReserva =
      "UPDATE Reservas SET estado_reserva = FALSE WHERE id_reserva = ?";

    conection.query(consultaReserva, [id], (err2) => {
      if (err2) {
        return res
          .status(500)
          .json({ message: "Error al eliminar la reserva" });
      }

      res.status(200).json({ message: "Reserva eliminada correctamente" });
    });
  });
};

const updateReserva = (req, res) => {
  const { id } = req.params;
  const { dia_reserva, id_cancha, horario_inicio, horario_fin, total_reserva } =
    req.body;

  const fecha = dayjs(dia_reserva, "DD-MM-YYYY").format("YYYY-MM-DD");

  const buscarIDHorario = `SELECT id_horario FROM horarios WHERE hora_inicio = ? AND hora_fin = ?`;

  conection.query(
    buscarIDHorario,
    [horario_inicio, horario_fin],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al buscar horario" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Horario no encontrado" });
      }

      const IDHorario = results[0].id_horario;

      const updateReservaQuery = `UPDATE reservas SET dia_reserva = ?, total = ? WHERE id_reserva = ?`;

      conection.query(
        updateReservaQuery,
        [fecha, total_reserva, id],
        (err2) => {
          if (err2) {
            return res
              .status(500)
              .json({ message: "Error al actualizar la reserva" });
          }

          const updateDetalleReserva = `UPDATE detalle_reservas SET id_cancha = ?, id_horario = ? WHERE id_reserva = ?`;

          conection.query(
            updateDetalleReserva,
            [id_cancha, IDHorario, id],
            (err3) => {
              if (err3) {
                return res.status(500).json({
                  message: "Error al actualizar el detalle de reserva",
                });
              }

              return res
                .status(200)
                .json({ message: "Reserva actualizada con éxito" });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getHorariosCancha,
  getOneReserva,
  getAllReservas,
  postReserva,
  getReservas,
  deleteReservas,
  updateReserva,
  cargarReservas,
};
