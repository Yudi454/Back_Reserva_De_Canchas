const conection = require("../config/database");

const getAllClientes = (req, res) => {
  const consulta =
    "SELECT id_cliente, usuario, email_cliente, telefono_cliente FROM clientes where estado_cliente=1";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener los clientes" });
    }
    return res.json(results);
  });
};

const getCliente = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_cliente, usuario, contraseña_cliente, email_cliente, telefono_cliente FROM clientes WHERE id_cliente = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener el cliente" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const data = results[0];

    return res.json({
      results: {
        id_cliente: data.id_cliente,
        usuario: data.usuario,
        contraseña_cliente: data.contraseña_cliente,
        email_cliente: data.email_cliente,
        telefono_cliente: data.telefono_cliente,
      },
    });
  });
};

const deleteClientes = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE CLIENTES SET ESTADO_CLIENTE = FALSE WHERE ID_CLIENTE = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el cliente" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el cliente para eliminar" });
    }

    return res.status(200).json({ message: "Cliente eliminado correctamente" });
  });
};

const updateClientes = (req, res) => {
  const { id } = req.params;
  const { usuario, email_cliente, telefono_cliente, contraseña_cliente } =
    req.body;

  const consulta =
    "UPDATE clientes SET usuario=?, email_cliente=?, telefono_cliente=?, contraseña_cliente=? WHERE id_cliente=?";

  conection.query(
    consulta,
    [usuario, email_cliente, telefono_cliente, contraseña_cliente, id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al actualizar el cliente" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No se encontró el cliente para actualizar" });
      }

      return res
        .status(200)
        .json({ message: "Cliente actualizado correctamente" });
    }
  );
};

const createCliente = (req, res) => {
  const { usuario, contraseña_cliente, email_cliente, telefono_cliente } =
    req.body;


  const consulta =
    "INSERT INTO Clientes (usuario, contraseña_cliente, email_cliente, telefono_cliente) VALUES (?,?,?,?)";

  conection.query(
    consulta,
    [usuario, contraseña_cliente, email_cliente, telefono_cliente],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al crear el cliente" });
      }

      return res.status(201).json({ message: "Cliente creado correctamente" });
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
