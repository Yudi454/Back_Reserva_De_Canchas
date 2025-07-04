const conection = require("../config/database");
const bcrypt = require("bcrypt");

const getUsuarios = (req, res) => {
  const consulta =
    "SELECT id_usuario, nombre_usuario, apellido_usuario, dni, email_usuario, rol, telefono_usuario FROM USUARIOS WHERE ESTADO_USUARIO = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getUsuario = (req, res) => {
  const { id } = req.params;
  

  const consulta =
    "SELECT id_usuario, nombre_usuario, apellido_usuario, dni, email_usuario, rol, telefono_usuario FROM USUARIOS WHERE id_usuario = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    const data = results[0]

    res.json({results: {
        id_usuario: data.id_usuario,
        nombre_usuario: data.nombre_usuario,
        apellido_usuario: data.apellido_usuario,
        dni: data.dni,
        email_usuario: data.email_usuario,
        rol: data.rol,
        telefono_usuario: data.telefono_usuario
    }});
  });
};

const createUsuario = async (req, res) => {
  const {
    nombre_usuario,
    apellido_usuario,
    contraseña_usuario,
    rol,
    dni,
    email_usuario,
    telefono_usuario,
  } = req.body;

  const contraseñaHash = await bcrypt.hash(contraseña_usuario, 10);

  const consulta =
    "INSERT INTO USUARIOS (NOMBRE_USUARIO,APELLIDO_USUARIO,CONTRASEÑA_USUARIO,ROL,DNI,EMAIL_USUARIO,TELEFONO_USUARIO) VALUES (?,?,?,?,?,?,?)";

  conection.query(
    consulta,
    [
      nombre_usuario,
      apellido_usuario,
      contraseñaHash,
      rol,
      dni,
      email_usuario,
      telefono_usuario,
    ],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Usuario creado con exito" });
    }
  );
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;

  const {
    nombre_usuario,
    apellido_usuario,
    rol,
    dni,
    email_usuario,
    telefono_usuario,
  } = req.body;

  //const contraseñaHash = bcrypt.hash(contraseña, 10);

  const consulta =
    "UPDATE USUARIOS SET NOMBRE_USUARIO = ?, APELLIDO_USUARIO = ?, ROL = ?, DNI = ?, EMAIL_USUARIO = ?, TELEFONO_USUARIO = ? WHERE ID_USUARIO = ?";

  conection.query(
    consulta,
    [
      nombre_usuario,
      apellido_usuario,
      rol,
      dni,
      email_usuario,
      telefono_usuario,
      id,
    ],
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
