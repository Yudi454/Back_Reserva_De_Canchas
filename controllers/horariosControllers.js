const conection = require("../config/database");
const dayjs = require("dayjs");

const getHorarios = (req, res) => {
  const consulta =
    "SELECT id_horario,hora_inicio,hora_fin FROM HORARIOS WHERE ESTADO_HORARIO = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener los horarios" });
    }
    return res.json(results);
  });
};

const getHorario = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_horario,hora_inicio,hora_fin FROM HORARIOS WHERE ID_HORARIO = ? ";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener el horario" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    const data = results[0];

    return res.json({
      results: {
        id_horario: data.id_horario,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
      },
    });
  });
};

const getHorariosDisponibles = (req, res) => {
  const { dia } = req.body;

  const fechaFormateada = dayjs(dia).format("YYYY-MM-DD");

  const consulta =
    "SELECT h.id_horario, h.hora_inicio, h.hora_fin FROM HORARIOS h WHERE h.estado_horario = true AND h.id_horario NOT IN (SELECT dr.id_horario FROM DETALLE_RESERVAS dr JOIN RESERVAS r ON r.id_reserva = dr.id_reserva WHERE r.dia_reserva = ?)";

  conection.query(consulta, [fechaFormateada], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener horarios disponibles" });
    }

    return res.json(results);
  });
};

const createHorario = (req, res) => {
  const { hora_inicio, hora_fin } = req.body;

  const consulta = "INSERT INTO HORARIOS (HORA_INICIO,HORA_FIN) VALUES (?,?)";

  conection.query(consulta, [hora_inicio, hora_fin], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al crear el horario" });
    }

    return res.status(201).json({ message: "Horario creado con éxito" });
  });
};

const updateHorario = (req, res) => {
  const { id } = req.params;
  const { hora_inicio, hora_fin } = req.body;

  const consulta =
    "UPDATE HORARIOS SET HORA_INICIO = ?, HORA_FIN = ? WHERE ID_HORARIO = ?";

  conection.query(consulta, [hora_inicio, hora_fin, id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar el horario" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el horario para actualizar" });
    }

    return res.status(200).json({ message: "Horario actualizado con éxito" });
  });
};

const deleteHorario = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE HORARIOS SET ESTADO_HORARIO = FALSE WHERE ID_HORARIO = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el horario" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el horario para eliminar" });
    }

    return res.status(200).json({ message: "Horario eliminado con éxito" });
  });
};

module.exports = {
  getHorario,
  getHorarios,
  getHorariosDisponibles,
  createHorario,
  updateHorario,
  deleteHorario,
};
