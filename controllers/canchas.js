const conection = require("../config/database.js");

const getAllCanchas = (req, res) => {
  const consulta = "SELECT * FROM canchas WHERE estado_cancha = true";

  conection.query(consulta, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener canchas" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No hay canchas disponibles" });
    }

    return res.status(200).json(results);
  });
};

const getOneCancha = (req, res) => {
  const id = req.params.id;

  const consulta =
    "select id_cancha, imagen_cancha, tipo_cancha, precio_cancha from canchas where id_cancha=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener la cancha" });
    }

    if (results.length === 0) {
      res.status(404).send("No se encontró la cancha");
    } else {
      const data = results[0];
      res.json({
        results: {
          id_cancha: data.id_cancha,
          imagen: data.imagen_cancha,
          tipo_cancha: data.tipo_cancha,
          precio_cancha: data.precio_cancha,
        },
      }); // enviás solo la cancha, no un array
    }
  });
};

const createCanchas = (req, res) => {
  if (!imagen_cancha || !tipo_cancha || !precio_cancha) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const { imagen_cancha, tipo_cancha, precio_cancha } = req.body;

  const consulta = `insert into canchas (imagen_cancha,tipo_cancha,precio_cancha)
  values(?,?,?)`;

  conection.query(
    consulta,
    [imagen_cancha, tipo_cancha, precio_cancha],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al crear la cancha" });
      }

      res.status(200).send({ message: "cancha creada con exito" });
    }
  );
};

const DeleteCancha = (req, res) => {
  const { id_cancha } = req.params;

  const consulta = `UPDATE canchas SET estado_cancha = false WHERE id_cancha = ?`;

  conection.query(consulta, [id_cancha], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar la cancha" });
    }

    if (results.affectedRows === 0) {
      // No se actualizó ninguna fila, id_cancha no existe
      return res
        .status(404)
        .json({ message: "No se encontró la cancha para eliminar" });
    }

    return res.status(200).json({ message: "Cancha eliminada correctamente" });
  });
};

const updateCanchas = (req, res) => {
  const { id } = req.params;
  const { imagen_cancha, tipo_cancha, precio_cancha } = req.body;

  const consulta = `UPDATE canchas SET imagen_cancha=?, precio_cancha=?, tipo_cancha=? WHERE id_cancha=?`;

  conection.query(
    consulta,
    [imagen_cancha, precio_cancha, tipo_cancha, id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al actualizar la cancha" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No se encontró la cancha para actualizar" });
      }

      return res.status(200).json({ message: "Actualización exitosa" });
    }
  );
};

module.exports = {
  getAllCanchas,
  getOneCancha,
  createCanchas,
  DeleteCancha,
  updateCanchas,
};
