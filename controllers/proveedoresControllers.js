const conection = require("../config/database");

const getProveedores = (req, res) => {
  const consulta =
    "SELECT id_proveedor, nombre_proveedor, telefono_proveedor, email_proveedor FROM PROVEEDORES WHERE ESTADO_PROVEEDOR = TRUE";

  conection.query(consulta, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener proveedores" });
    }
    res.json(results);
  });
};

const getProveedor = (req, res) => {
  const { id } = req.params;

  const consulta =
    "SELECT id_proveedor, nombre_proveedor,imagen_proveedor, telefono_proveedor, email_proveedor FROM PROVEEDORES WHERE ID_PROVEEDOR = ? AND ESTADO_PROVEEDOR = TRUE";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener proveedor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    const data = results[0];
console.log(data);

    res.json({
      results: {
        id_proveedor: data.id_proveedor,
        nombre_proveedor: data.nombre_proveedor,
        telefono_proveedor: data.telefono_proveedor,
        email_proveedor: data.email_proveedor,
        imagen: data.imagen_proveedor,
        imagen_proveedor: data.imagen_proveedor
      },
    });
  });
};

const buscarProveedorPorNombre = (req, res) => {
  const { nombre_proveedor } = req.body;

  const consulta = `SELECT 
       id_proveedor, 
       nombre_proveedor, 
       email_proveedor, 
       telefono_proveedor, 
       fecha_creacion_proveedor, 
       estado_proveedor 
     FROM PROVEEDORES 
     WHERE estado_proveedor = true 
       AND nombre_proveedor LIKE ? 
     ORDER BY id_proveedor`;

  conection.query(consulta, [`%${nombre_proveedor}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar proveedores" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron resultados" });
    }

    console.log(results);
    
    return res.json(results);
  });
};

const createProveedor = (req, res) => {
  const { nombre_proveedor,imagen_proveedor, email_proveedor, telefono_proveedor } = req.body;

  const consulta =
    "INSERT INTO PROVEEDORES (NOMBRE_PROVEEDOR,IMAGEN_PROVEEDOR, EMAIL_PROVEEDOR, TELEFONO_PROVEEDOR) VALUES (?, ?, ?)";

  conection.query(
    consulta,
    [nombre_proveedor,imagen_proveedor, email_proveedor, telefono_proveedor],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al crear proveedor" });
      }

      return res.status(201).json({ message: "Proveedor creado con éxito" });
    }
  );
};

const updateProveedor = (req, res) => {
  const { id } = req.params;
  const { nombre_proveedor, imagen_proveedor, email_proveedor, telefono_proveedor } = req.body;

  const consulta =
    "UPDATE PROVEEDORES SET NOMBRE_PROVEEDOR = ?, IMAGEN_PROVEEDOR = ?, EMAIL_PROVEEDOR = ?, TELEFONO_PROVEEDOR = ? WHERE ID_PROVEEDOR = ?";

  conection.query(
    consulta,
    [nombre_proveedor, imagen_proveedor, email_proveedor, telefono_proveedor, id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al actualizar proveedor" });
      }

      return res.status(200).json({ message: "Proveedor editado con éxito" });
    }
  );
};

const deleteProveedor = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE PROVEEDORES SET ESTADO_PROVEEDOR = FALSE WHERE ID_PROVEEDOR = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar proveedor" });
    }
    res.status(200).json({ message: "Proveedor eliminado con éxito" });
  });
};

module.exports = {
  getProveedor,
  getProveedores,
  buscarProveedorPorNombre,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
