const bcrypt = require("bcrypt");
const { conection } = require("../config/database");

const login = async (req, res) => {
  const { email, contraseña } = req.body;

  const consulta = "SELECT * FROM CLIENTES WHERE EMAIL_CLIENTE = ? ";

  conection.query(consulta, [email], (err, results) => {
    if (err) {
      const consulta = "SELECT * FROM USUARIOS WHERE EMAIL_USUARIO = ?";

      conection.query(consulta, [email], (err, results) => {
        if (err) throw err;
        const match = bcrypt.compare(contraseña, results[0].contraseña_cliente);

        if (match) {
          res.json({
            message: "Usuario logueado con exito",
            results: results,
          });
        } else {
          res.send({ message: "Email o contraseña invalido" });
        }
      });
    }
    const match = bcrypt.compare(contraseña, results[0].contraseña_cliente);

    if (match) {
      res.json({
        message: "Usuario logueado con exito",
        results: results,
      });
    } else {
      res.send({ message: "Email o contraseña invalido" });
    }
  });
};

const register = async (req, res) => {
  const { usuario, contraseña, email, telefono } = req.body;

  let contraseñaHash = await bcrypt.hash(contraseña, 10);

  const consulta =
    "INSERT INTO CLIENTES (USUARIO,CONTRASEÑA_CLIENTE,EMAIL_CLIENTE,TELEFONO_CLIENTE) VALUES (?,?,?,?)";

  conection.query(
    consulta,
    [usuario, contraseñaHash, email, telefono],
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
