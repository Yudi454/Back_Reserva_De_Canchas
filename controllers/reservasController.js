const conection =require("../config/database.js")




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

const getOneReserva=(req,res)=>{
  const id_reserva=req.body

  const consulta = `select * from reserva where id_reserva=?`

  conection.query(consulta,[id_reserva],(err,results)=>{
    if(err) return res.status(500).json({error:"error al traer la reserva",err})

    if(results.length===0) return res.status(200).json({message:"la reserva no existe"})
  
    res.status(200).send(results)
  })
}

const getAllReservas=(req,res)=>{
  const consulta=`select * from reservas`

  conection.query(consulta,(err,results)=>{
    if(err){
      console.error("error buscando reservas",err)
      res.status(500).send(({ error: "Error al buscar reservas" }))
    }

    res.status(200).send(results)
  })
}

const postReserva = (req, res) => {

  console.log("Datos recibidos en la reserva:", req.body);

  const { id_cliente, id_cancha,precio, dia_reserva, horario_inicio, horario_fin } =
    req.body;

  if (!id_cliente || !id_cancha || !precio || !dia_reserva || !horario_inicio || !horario_fin) {
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
      INSERT INTO Reservas (dia_reserva,total, id_cliente)
      VALUES (?, ?,?)
    `;

    conection.query(insertReserva,[dia_reserva,precio, id_cliente],(err2, result2) => {
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

  conection.query(consulta,[usuario], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.send([]);
    } else {
      res.json(results);
    }
  });
}

const deleteReservas=(req,res)=>{
  const {id_reserva} = req.params

  const consultaDetalle= "update Detalle_Reservas set estado_detalle_reserva=0 WHERE id_reserva = ?;"

  conection.query(consultaDetalle,[id_reserva],(err)=>{
    if(err) return res.status(500).json({error:"error al eliminar el detalle:"});


    const consultaReserva="update Reservas set estado_reserva=0 WHERE id_reserva = ?;"

    conection.query(consultaReserva,[id_reserva],(err2)=>{
      if(err2) return res.status(500).json({error:"error al eliminar la reserva back"})

      res.json({mensaje:"Reserva eliminada correctamente"})
    })
  
  })


}

const updateReserva=(req,res)=>{

  const {id_reserva}=req.params

  const {dia_reserva,id_cancha,horario_inicio,horario_fin,total,}=req.body

  const buscarIDHorario=`select id_horario from horarios where horario_inicio=? and horario_fin=?`

  conection.query(buscarIDHorario,[horario_inicio,horario_fin],(err,results)=>{
    if (err) {
      console.error("Error buscando horario:", err);
      return res.status(500).json({ error: "Error al buscar horario" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }

    const IDHorario=results[0].id_horario

    const updateReservaQuery=`update reservas set dia_reserva=? ,total=?
    where id_reserva=?`

    conection.query(updateReservaQuery,[dia_reserva,total,id_reserva],(err2,results2)=>{
      if (err2) {
        console.error("Error al actualizar la reserva:", err2);
        return res.status(500).json({ error: "Error al actualizar la reserva" });
      }

      const updateDetalleReserva=`update detalle_reservas set id_cancha=?,id_horario=? 
      where id_reserva=?`

      conection.query(updateDetalleReserva,[id_cancha,IDHorario,id_reserva],(err3,results3)=>{
        if (err3) {
          console.error("Error al actualizar el detalle de reserva:", err3);
          return res.status(500).json({ error: "Error al actualizar el detalle de reserva" });
        }

        res.json({ mensaje: "Reserva actualizada con éxito" });
      })
    })

  })

}


module.exports={getHorariosCancha,getOneReserva,getAllReservas,postReserva,getReservas,deleteReservas, updateReserva }