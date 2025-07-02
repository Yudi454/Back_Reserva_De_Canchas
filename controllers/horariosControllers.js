const conection = require("../config/database");
const dayjs = require("dayjs");

const getHorarios = (req, res) => {
  const consulta =
    "SELECT id_horario,hora_inicio,hora_fin FROM HORARIOS WHERE ESTADO_HORARIO = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};
const getHorario = (req, res) => {
  const { id } = req.params;
  const consulta =
    "SELECT id_horario,hora_inicio,hora_fin FROM HORARIOS WHERE ID_HORARIO = ? AND ESTADO_HORARIO = TRUE";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getHorariosDisponibles = (req, res) => {
  const { dia } = req.body;

  const fechaFormateada = dayjs(dia).format("YYYY-MM-DD");

  console.log(dia);

  const consulta =
    "SELECT h.id_horario, h.hora_inicio, h.hora_fin FROM HORARIOS h WHERE h.estado_horario = true AND h.id_horario NOT IN (SELECT dr.id_horario FROM DETALLE_RESERVAS dr JOIN RESERVAS r ON r.id_reserva = dr.id_reserva WHERE r.dia_reserva = ?)";

  conection.query(consulta, [fechaFormateada], (err, results) => {
    if (err) throw err;

    res.json(results);
  });
};

const createHorario = (req, res) => {
  const { hora_inicio, hora_fin } = req.body;

  const consulta = "INSERT INTO HORARIOS (HORA_INICIO,HORA_FIN) VALUES (?,?)";

  conection.query(consulta, [hora_inicio, hora_fin], (err, results) => {
    if (err) throw err;
    res.send({ message: "Horario creado con exito" });
  });
};

const updateHorario = (req, res) => {
  const { id } = req.params;
  const { hora_inicio, hora_fin } = req.body;

  const consulta =
    "UPDATE HORARIOS SET HORA_INICIO = ?, HORA_FIN = ? WHERE ID_HORARIO = ?";

  conection.query(consulta, [hora_inicio, hora_fin, id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Horario actualizado con exito" });
  });
};

const deleteHorario = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE HORARIOS SET ESTADO_HORARIO = FALSE WHERE ID_HORARIO = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Horario eliminado con exito" });
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
