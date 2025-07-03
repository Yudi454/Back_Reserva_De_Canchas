const conection = require("../config/database");

const getAllClientes = (req, res) => {
  const consulta =
    "SELECT id_cliente, usuario, email_cliente, telefono_cliente FROM clientes";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getCliente = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_cliente, usuario, email_cliente, telefono_cliente FROM clientes WHERE id_cliente = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    const data = results[0];

    res.json({
      results: {
        id_cliente: data.id_cliente,
        usuario: data.usuario,
        email_cliente: data.email_cliente,
        telefono_cliente: data.telefono_cliente,
      },
    });
  });
};

const deleteClientes = (req, res) => {
  const { id } = req.params;

  const consulta = "DELETE FROM Clientes WHERE id_cliente=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;

    res.status(200).send({ message: "cliente eliminado correctamente" });
  });
};

const updateClientes = (req, res) => {
  const { id } = req.params;

  const { usuario, email_cliente, telefono_cliente } = req.body;

  const consulta =
    "UPDATE clientes SET usuario=?, email_cliente=?, telefono_cliente=? WHERE id_cliente=?";

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
      if (err) err;
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
