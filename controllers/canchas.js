const conection = require("../config/database.js");

const getAllCanchas = (req, res) => {
  const consulta = "select * from canchas where estado_cancha = true";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.send("no hay canchas");
    } else {
      res.json(results);
      console.log(results);
      
    }
  });
};

const getOneCancha = (req, res) => {
  const id = req.params.id;

  const consulta =
    "select id_cancha, imagen_cancha, tipo_cancha, precio_cancha from canchas where id_cancha=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.status(404).send("No se encontró la cancha");
    } else {
      const data = results[0]
      res.json({ results: {
        id_cancha: data.id_cancha,
        imagen: data.imagen_cancha,
        tipo_cancha: data.tipo_cancha,
        precio_cancha: data.precio_cancha
      } }); // enviás solo la cancha, no un array
    }
  });
};

const createCanchas = (req, res) => {
  const { imagen_cancha, tipo_cancha, precio_cancha } = req.body;

  const consulta = `insert into canchas (imagen_cancha,tipo_cancha,precio_cancha)
  values(?,?,?)`;

  conection.query(
    consulta,
    [imagen_cancha, tipo_cancha, precio_cancha],
    (err, results) => {
      if (err) throw err;

      res.status(200).send({ message: "cancha creada con exito" });
    }
  );
};

const DeleteCancha = (req, res) => {
  //eliminado logico de canchas
  const {id_cancha} = req.params;

  const consulta = `update canchas set estado_cancha = false where id_cancha = ?`;

  conection.query(consulta, [id_cancha], (err, results) => {
    if (err) throw err;
    res.status(200).send({ message: "cancha eliminada" });
  });
};

const updateCanchas = (req, res) => {
  const { id } = req.params;

  const { imagen_cancha, tipo_cancha, precio_cancha } = req.body;

  const consulta = `update canchas set imagen_cancha=?, precio_cancha=?, tipo_cancha = ?
  where id_cancha=?`;

  conection.query(
    consulta,
    [imagen_cancha, precio_cancha, tipo_cancha, id],
    (err, results) => {
      if (err) throw err;
      res.status(200).send({ message: "actualizacion exitosa" });
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
