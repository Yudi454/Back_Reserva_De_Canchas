const bcrypt = require("bcrypt");
const { conection } = require("../config/database");

const login = (req, res) => {
  const { email, contraseña } = req.body;

  const consulta = "SELECT * FROM CLIENTES WHERE EMAIL_CLIENTE = ? ";

  conection.query(consulta, [email], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const match = await bcrypt.compare(
        contraseña,
        results[0].contraseña_cliente
      );

      if (match) {
        return res.json({
          message: "Usuario logueado con exito",
          results: {
            id_cliente: results[0].id_clientes,
            usuario: results[0].usuario,
          },
        });
      } else {
        console.log("entro por el error de cliente");

        res.send({ message: "email y contraseñas incorrectos" });
      }
    } else {
      const consulta = "SELECT * FROM usuarios WHERE email_usuario = ?";

      conection.query(consulta, [email], async (err, results) => {
        if (err) throw err;
        console.log("contraseña (input):", `"${contraseña}"`);
        console.log("hash almacenado:", `"${results[0].contraseña_usuario}"`);
        const match = await bcrypt.compare(
          contraseña.trim(),
          results[0].contraseña_usuario.trim()
        );
        console.log(match);
        if (match) {
          return res.json({
            message: "Usuario logueado con exito",
            results: results,
          });
        } else {
          res.send({ message: "Email o contraseña incorrectos" });
        }
      });
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
