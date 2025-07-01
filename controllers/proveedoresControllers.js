const conection = require("../config/database");

const getProveedores = (req, res) => {
  const consulta =
    "SELECT id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor FROM PROVEEDORES WHERE ESTADO_PROVEEDOR = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getProveedor = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor FROM PROVEEDORES WHERE ID_PROVEEDOR = ? AND ESTADO_PROVEEDOR = TRUE";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    const data = results[0];

    res.json({
      results: {
        id_proveedor: data.id_proveedor,
        nombre_proveedor: data.nombre_proveedor,
        telefono_proveedor: data.telefono_proveedor,
        email_proveedor: data.email_proveedor,
      },
    });
  });
};

const createProveedor = (req, res) => {
  const { nombre_proveedor, email_proveedor, telefono_proveedor } = req.body;

  const consulta =
    "INSERT INTO PROVEEDORES (NOMBRE_PROVEEDOR,EMAIL_PROVEEDOR,TELEFONO_PROVEEDOR) VALUES (?,?,?)";

  conection.query(consulta, [nombre_proveedor, email_proveedor, telefono_proveedor], (err, results) => {
    if (err) throw err;
    res.send({ message: "Proveedor creado con exito" });
  });
};

const updateProveedor = (req, res) => {
  const { id } = req.params;

  const { nombre_proveedor, email_proveedor, telefono_proveedor } = req.body;

  const consulta =
    "UPDATE PROVEEDORES SET NOMBRE_PROVEEDOR = ?, EMAIL_PROVEEDOR = ?, TELEFONO_PROVEEDOR = ? WHERE ID_PROVEEDOR = ?";

  conection.query(
    consulta,
    [nombre_proveedor, email_proveedor, telefono_proveedor, id],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Proveedor editado con exito" });
    }
  );
};

const deleteProveedor = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE PROVEEDORES SET ESTADO_PROVEEDOR = FALSE WHERE ID_PROVEEDOR = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Proveedor eliminado con exito" });
  });
};

module.exports = {
  getProveedor,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
