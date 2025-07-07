const bcrypt = require("bcrypt");
const conection = require("../config/database");

const login = (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }


  const consulta =
    "select * from clientes where email_cliente = ? and contraseña_cliente = ?";

  conection.query(consulta, [email, contraseña], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length > 0) {
      //SI ES CLIENTE
      return res.json({
        message: "Usuario logueado con exito",
        results: {
          id_cliente: results[0].id_cliente,
          usuario: results[0].usuario,
          email_cliente: results[0].email_cliente,
        },
      });
    } else {
      const consulta =
        "SELECT * FROM usuarios WHERE EMAIL_USUARIO = ? AND CONTRASEÑA_USUARIO = ? ";

      conection.query(consulta, [email, contraseña], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          //SI ES USUARIO
          return res.json({
            message: "Usuario logueado con exito",
            results: {
              id_usuario: results[0].id_usuario,
              email_usuario: results[0].email_usuario,
              rol: results[0].rol,
            },
          });
        } else {
          // No se encontró ni en CLIENTES ni en USUARIOS
          return res
            .status(401)
            .json({ message: "Email o contraseña incorrectos" });
        }
      });
    }
  });
};

const register = async (req, res) => {

  const { usuario, contraseña, email, telefono } = req.body;
  if (!usuario || !contraseña || !email || !telefono) {
    return res.status(400).send({ message: "Faltan campos obligatorios" });
  }


  const consulta =
    "INSERT INTO CLIENTES (USUARIO,CONTRASEÑA_CLIENTE,EMAIL_CLIENTE,TELEFONO_CLIENTE) VALUES (?,?,?,?)";

  conection.query(
    consulta,
    [usuario, contraseña, email, telefono],
    (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // Error por clave duplicada
          return res
            .status(409)
            .send({ message: "El email ya está registrado" });
        }
        // Otros errores
        return res.status(500).send({ message: "Error interno del servidor" });
      }

      res.send({ message: "Usuario creado con éxito" });
    }
  );
};

module.exports = {
  register,
  login,
};
