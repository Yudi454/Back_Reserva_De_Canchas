const  conection  = require("../config/database");

const getAllClientes = (req, res) => {
  const consulta =
    "SELECT id_clientes, usuario, email_cliente, telefono_cliente FROM clientes";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getCliente = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_clientes, usuario, email_cliente, telefono_cliente FROM clientes WHERE id_clientes = ?";

  conection.query(consulta, [id], (err, results) => {
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
  const { id } = req.params;

  const { usuario, email_cliente, telefono_cliente } =
    req.body;

  const consulta =
    "UPDATE clientes SET usuario=?, email_cliente=?, telefono_cliente=? WHERE id_clientes=?";

  conection.query(
    consulta,
    [usuario, email_cliente, telefono_cliente, id],
    (err, results) => {
      if (err) throw err;

      res.status(200).send({ message: "cliente actualizado correctamente" });
    }
  );
};

const createCliente = (req, res) => {
  const { usuario, contraseña_cliente, email_cliente, telefono_cliente } =
    req.body;

  const consulta =
    "INSERT INTO Clientes (usuario,contraseña_cliente,email_cliente,telefono_cliente) VALUES (?,?,?,?)";

  conection.query(
    consulta,
    [usuario, contraseña_cliente, email_cliente, telefono_cliente],
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
  getCliente,
  deleteClientes,
  updateClientes,
  createCliente,
};
