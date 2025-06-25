require("dotenv").config();
const { conection } = require("../config/database");

const getAllClientes = (req, res) => {
  const consulta = "select * from Clientes";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const deleteClientes = (req, res) => {
  const { id } = req.params;

  const consulta = "DELETE FROM Clientes WHERE id_clientes=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    res.status(200).send({ message: "cliente eliminado correctamente" });
  });
};

const updateClientes = (req, res) => {

  const {id} = req.params;
  const usuario = req.body.usuario;
  const contraseña_cliente = req.body.contraseña_cliente;
  const email_cliente = req.body.email_cliente;
  const telefono_cliente = req.body.telefono_cliente;
  

  const consulta =
    "UPDATE Clientes SET usuario=?, contraseña_cliente=?, email_cliente=?, telefono_cliente=? WHERE id_clientes=?";

  conection.query(consulta,[usuario,contraseña_cliente,email_cliente,telefono_cliente,id],
    (err, results) => {
      if (err) throw err

      res.status(200).send({ message: "cliente actualizado correctamente" });
    }
  );
};

const createCliente = (req, res) => {
  const {
    usuario,
    contraseña_cliente,
    email_cliente,
    telefono_cliente,
  } = req.body;

  const consulta =
    "insert into Clientes (usuario,contraseña_cliente,email_cliente,telefono_cliente) values (?,?,?,?)";

  conection.query(
    consulta,
    [
      usuario,
      contraseña_cliente,
      email_cliente,
      telefono_cliente,
    ],
    (err, results) => {
      if (err) {
      console.error(err); // ayuda para debug
      return res.status(500).send({
        message: "algo salió mal, no se pudo crear el cliente",
      });
    }

    return res.send({ message: "Cliente creado correctamente" });
  }
  );
};

module.exports = {
  getAllClientes,
  deleteClientes,
  updateClientes,
  createCliente,
};
