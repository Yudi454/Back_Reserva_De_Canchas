const  conection  = require("../config/database");

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

  const consulta =
    "SELECT hora_inicio,hora_fin FROM HORARIOS h WHERE h.id_horario NOT IN (SELECT dv.id_horario FROM DETALLE_RESERVAS dv JOIN RESERVAS r ON r.id_reserva = dv.id_reserva WHERE r.dia_reserva = ?) AND h.estado_horario = true";

  conection.query(consulta, [dia], (err, results) => {
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
