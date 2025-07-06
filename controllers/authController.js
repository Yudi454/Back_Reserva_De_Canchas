const bcrypt = require("bcrypt");
const conection = require("../config/database");

const login = (req, res) => {
  const { email, contraseña } = req.body;

  const consulta =
    "SELECT * FROM CLIENTES WHERE EMAIL_CLIENTE = ? AND CONTRASEÑA_CLIENTE = ? ";

  conection.query(consulta, [email, contraseña], async (err, results) => {
    if (err) throw err;
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
        //SI ES USUARIO
        return res.json({
          message: "Usuario logueado con exito",
          results: {
            id_usuario: results[0].id_Usuario,
            email_usuario: results[0].email_usuario,
            rol: results[0].rol,
          },
        });
      });
    }
  });
};

const register = async (req, res) => {
  const { usuario, contraseña, email, telefono } = req.body;

  const consulta =
    "INSERT INTO CLIENTES (USUARIO,CONTRASEÑA_CLIENTE,EMAIL_CLIENTE,TELEFONO_CLIENTE) VALUES (?,?,?,?)";

  conection.query(
    consulta,
    [usuario, contraseña, email, telefono],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Usuario creado con exito" });
    }
  );
};

module.exports = {
  register,
  login,
};
