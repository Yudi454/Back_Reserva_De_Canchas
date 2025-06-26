const conection =require("../config/database.js")

const getAllCanchas = (req, res) => {
  const consulta = "select * from canchas";

  conection.query(consulta, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send("no hay canchas");
    } else {
      res.json(results);
    }
  });
};

const getOneCancha = (req, res) => {
  const id = req.params.id;

  const consulta = "select * from canchas where id_cancha=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.status(404).send("No se encontró la cancha");
    } else {
      res.json(results[0]); // enviás solo la cancha, no un array
    }
  });
};

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

const postReserva = (req, res) => {

  console.log("Datos recibidos en la reserva:", req.body);

  const { id_usuario, id_cancha,precio, dia_reserva, horario_inicio, horario_fin } =
    req.body;

  if (!id_usuario || !id_cancha || !precio || !dia_reserva || !horario_inicio || !horario_fin) {
    return res
      .status(400)
      .json({ error: "Faltan datos para crear la reserva" });
  }

  const buscarHorario = `
    SELECT id_horario 
    FROM Horarios 
    WHERE hora_inicio = ? AND hora_fin = ?
  `;

  conection.query(buscarHorario, [horario_inicio, horario_fin], (err, results) => {
    if (err) {
      console.error("Error buscando horario:", err);
      return res.status(500).json({ error: "Error al buscar horario" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }

    const id_horario = results[0].id_horario;

    const insertReserva = `
      INSERT INTO Reservas (dia_reserva,total, id_usuario)
      VALUES (?, ?,?)
    `;

    conection.query(insertReserva,[dia_reserva,precio, id_usuario],(err2, result2) => {
      if (err2) {
        console.error("Error insertando en Reservas:", err2);
        return res.status(500).json({ error: "Error al crear reserva" });
      }

      const id_reserva = result2.insertId;

      const insertDetalle = `
      INSERT INTO Detalle_Reservas (id_reserva, id_cancha, id_horario)
      VALUES (?, ?, ?)
      `;

      conection.query(insertDetalle,[id_reserva, id_cancha, id_horario],(err3, results3) => {
        if (err3) {
          console.error("Error insertando en Detalle_Reservas:", err3);
          return res
            .status(500)
                .json({ error: "Error al crear el detalle de reserva" });
        }
          res
            .status(201)
            .json({ mensaje: "Reserva creada con éxito", id_reserva });
      });
    });
  });
};

const getReservas=(req,res)=>{

  const usuario=req.query.usuario

  if (!usuario) {
    return res.status(400).json({ error: "Falta el id del usuario" });
  }


  const consulta = `SELECT 
  r.dia_reserva,
  c.tipo_cancha,
  c.precio_cancha,
  h.hora_inicio,
  h.hora_fin
  FROM Reservas r
  JOIN Detalle_Reservas dr ON r.id_reserva = dr.id_reserva
  JOIN Canchas c ON dr.id_cancha = c.id_cancha
  JOIN Horarios h ON dr.id_horario = h.id_horario
  WHERE r.id_usuario = ?;`;

  conection.query(consulta,[usuario], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send("no hay reservas");
    } else {
      res.json(results);
    }
  });
}

module.exports = { getAllCanchas, getOneCancha, getHorariosCancha,postReserva,getReservas };
