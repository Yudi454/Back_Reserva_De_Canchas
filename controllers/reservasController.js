const dayjs = require("dayjs");
const conection = require("../config/database.js");

const getHorariosCancha = (req, res) => {
  const { id } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ error: "Debe proporcionar una fecha" });
  }

  const consulta = `
    SELECT h.id_horario, h.hora_inicio, h.hora_fin
    FROM Horarios h
    WHERE h.id_horario NOT IN (
      SELECT dr.id_horario
      FROM Detalle_Reservas dr
      JOIN Reservas r ON dr.id_reserva = r.id_reserva
      WHERE dr.id_cancha = ? AND r.dia_reserva = ?
    )
  `;

  conection.query(consulta, [id, fecha], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    res.json(results);
  });
};

const getOneReserva = (req, res) => {
  const { id } = req.params;

  const consulta = `SELECT r.id_reserva, cl.usuario, cl.email_cliente, cl.telefono_cliente, r.total, r.dia_reserva, h.hora_inicio, h.hora_fin, ca.id_cancha, ca.tipo_cancha, ca.precio_cancha
FROM RESERVAS r
JOIN CLIENTES cl ON r.id_cliente = cl.id_cliente
JOIN DETALLE_RESERVAS dv ON dv.id_reserva = r.id_reserva
JOIN CANCHAS ca ON dv.id_cancha = ca.id_cancha
JOIN HORARIOS h ON dv.id_horario = h.id_horario
WHERE r.id_reserva = ?
`;

  conection.query(consulta, [id], (err, results) => {
    if (err)
      return res.status(500).json({ error: "error al traer la reserva", err });

    if (results.length === 0)
      return res.status(200).json({ message: "la reserva no existe" });

    const data = results[0];

    res.json({
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
      },
    });
  });
};

const getAllReservas = (req, res) => {
  const consulta = `SELECT r.id_reserva, c.usuario, r.total, dia_reserva, h.hora_inicio, h.hora_fin FROM RESERVAS r JOIN CLIENTES c JOIN DETALLE_RESERVAS dv JOIN HORARIOS h
  ON r.id_cliente = c.id_cliente and dv.id_horario = h.id_horario WHERE estado_detalle_reserva = true
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("error buscando reservas", err);
      res.status(500).send({ error: "Error al buscar reservas" });
    }

    const reservasFormateadas = results.map((r) => ({
      ...r,
      dia_reserva: dayjs(r.dia_reserva).format("DD-MM-YYYY"),
    }));

    res.json(reservasFormateadas);
  });
};

const postReserva = (req, res) => {
  const { fecha_reserva, email_cliente, id_cancha, id_horario } = req.body;

  const fecha = dayjs(fecha_reserva, "D-M-YYYY").format("YYYY-MM-DD");

  const consulta = "SELECT id_cliente FROM clientes WHERE email_cliente = ?";

  conection.query(consulta, [`${email_cliente}`], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const id_cliente = results[0].id_cliente;
      console.log(id_cliente);

      const consulta =
        "SELECT hora_inicio,hora_fin FROM HORARIOS WHERE id_horario = ?";
      conection.query(consulta, [id_horario], (err, results) => {
        if (err) throw err;
        const data = results[0];
        const inicio = dayjs(`1970-01-01T${data.hora_inicio}`);
        const fin = dayjs(`1970-01-01T${data.hora_fin}`);
        const diferencia = fin.diff(inicio, "hour");
        const consulta =
          "SELECT precio_cancha FROM CANCHAS WHERE id_cancha = ?";
        conection.query(consulta, [id_cancha], (err, results) => {
          if (err) throw err;
          const precio = results[0].precio_cancha;
          const total = diferencia * precio;
          const consulta =
            "INSERT INTO RESERVAS (ID_CLIENTE,TOTAL,DIA_RESERVA) VALUES  (?,?,?)";

          conection.query(
            consulta,
            [id_cliente, total, fecha],
            (err, results) => {
              if (err) throw err;
              const id_reserva = results.insertId;

              const consulta =
                "INSERT INTO DETALLE_RESERVAS (ID_RESERVA,ID_HORARIO,ID_CANCHA) VALUES(?,?,?)";

              conection.query(
                consulta,
                [id_reserva, id_horario, id_cancha],
                (err, results) => {
                  if (err) throw err;
                  res.send({ message: "Reserva realizada con exito" });
                }
              );
            }
          );
        });
      });
    } else {
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  });
};

const getReservas = (req, res) => {
  const usuario = req.query.usuario;

  if (!usuario) {
    return res.status(400).json({ error: "Falta el id del usuario" });
  }

  const consulta = `SELECT 
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
  WHERE r.id_cliente = ? AND dr.estado_detalle_reserva = 1;`;

  conection.query(consulta, [usuario], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send([]);
    } else {
      res.json(results);
    }
  });
};

const deleteReservas = (req, res) => {
  const { id } = req.params;


  const consultaDetalle =
    "update detalle_reservas set estado_detalle_reserva = false WHERE id_reserva = ?;";

  conection.query(consultaDetalle, [id], (err) => {
    if (err)
      return res.status(500).json({ error: "error al eliminar el detalle:" });

    const consultaReserva =
      "update Reservas set estado_reserva=0 WHERE id_reserva = ?;";

    conection.query(consultaReserva, [id], (err2) => {
      if (err2)
        return res
          .status(500)
          .json({ error: "error al eliminar la reserva back" });

      res.json({ mensaje: "Reserva eliminada correctamente" });
    });
  });
};

const updateReserva = (req, res) => {
  const { id } = req.params;

  const { dia_reserva, id_cancha, horario_inicio, horario_fin, total_reserva } =
    req.body;

  const fecha = dayjs(dia_reserva, "DD-MM-YYYY").format("YYYY-MM-DD");

  const buscarIDHorario = `select id_horario from horarios where hora_inicio=? and hora_fin=?`;

  conection.query(
    buscarIDHorario,
    [horario_inicio, horario_fin],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al buscar horario" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Horario no encontrado" });
      }

      const IDHorario = results[0].id_horario;

      const updateReservaQuery = `update reservas set dia_reserva=? ,total=?
    where id_reserva=?`;

      conection.query(
        updateReservaQuery,
        [fecha, total_reserva, id],
        (err2, results2) => {
          if (err2) {
            return res
              .status(500)
              .json({ error: "Error al actualizar la reserva" });
          }

          const updateDetalleReserva = `update detalle_reservas set id_cancha=?,id_horario=? 
      where id_reserva=?`;

          conection.query(
            updateDetalleReserva,
            [id_cancha, IDHorario, id],
            (err3, results3) => {
              if (err3) {
                console.error(
                  "Error al actualizar el detalle de reserva:",
                  err3
                );
                return res
                  .status(500)
                  .json({ error: "Error al actualizar el detalle de reserva" });
              }

              res.json({ mensaje: "Reserva actualizada con éxito" });
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
};
