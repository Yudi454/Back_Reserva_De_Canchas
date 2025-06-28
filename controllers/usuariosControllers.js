const { conection } = require("../config/database");
const bcrypt = require("bcrypt");

const getUsuarios = (req, res) => {
  const consulta = "SELECT id_usuario, nombre_usuario, apellido_usuario, dni, email_usuario, rol, telefono_usuario FROM USUARIOS WHERE ESTADO_USUARIO = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getUsuario = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_usuario, nombre_usuario, apellido_usuario, dni, email_usuario, rol, telefono_usuario FROM USUARIOS WHERE ID_USUARIO = ? AND ESTADO_USUARIO = TRUE";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const createUsuario = async (req, res) => {
  const { nombre, apellido, contraseña, rol, dni, email, telefono } = req.body;

  const contraseñaHash = await bcrypt.hash(contraseña, 10);

  const consulta =
    "INSERT INTO USUARIOS (NOMBRE_USUARIO,APELLIDO_USUARIO,CONTRASEÑA_USUARIO,ROL,DNI,EMAIL_USUARIO,TELEFONO_USUARIO) VALUES (?,?,?,?,?,?,?)";

  conection.query(
    consulta,
    [nombre, apellido, contraseñaHash, rol, dni, email, telefono],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Usuario creado con exito" });
    }
  );
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;

  const { nombre_usuario, apellido_usuario, rol, dni, email_usuario, telefono_usuario } = req.body;

  //const contraseñaHash = bcrypt.hash(contraseña, 10);

  const consulta =
    "UPDATE USUARIOS SET NOMBRE_USUARIO = ?, APELLIDO_USUARIO = ?, ROL = ?, DNI = ?, EMAIL_USUARIO = ?, TELEFONO_USUARIO = ? WHERE ID_USUARIO = ?";

  conection.query(
    consulta,
    [nombre_usuario, apellido_usuario, rol, dni, email_usuario, telefono_usuario, id],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Usuario actualizado con exito" });
    }
  );
};

const deleteUsuario = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE USUARIOS SET ESTADO_USUARIO = FALSE WHERE ID_USUARIO = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Usuario eliminado con exito" });
  });
};

module.exports = {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
