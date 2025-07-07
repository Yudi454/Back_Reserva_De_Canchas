const conection = require("../config/database");

const getProductos = (req, res) => {
  const consulta =
    "SELECT id_producto, nombre_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE estado_producto = true ORDER BY pro.id_producto";

  conection.query(consulta, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener los productos" });
    }

    return res.json(results);
  });
};

const getProducto = (req, res) => {
  const { id } = req.params;
  const consulta =
    "SELECT id_producto, nombre_producto, imagen_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE pro.id_producto = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener el producto" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const data = results[0];

    return res.json({
      results: {
        id_producto: data.id_producto,
        nombre_producto: data.nombre_producto,
        precio_producto: data.precio_producto,
        stock: data.stock,
        nombre_proveedor: data.nombre_proveedor,
        imagen: data.imagen_producto,
        imagen_producto: data.imagen_producto
      },
    });
  });
};

const buscarPorNombre = (req, res) => {
  const { nombre_producto } = req.body;

  const consulta =
    "SELECT pro.id_producto, pro.nombre_producto, pro.precio_producto, pro.stock, pro.imagen_producto, pve.nombre_proveedor, pve.telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE estado_producto = true AND pro.nombre_producto LIKE ? ORDER BY pro.id_producto";

  conection.query(consulta, [`%${nombre_producto}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar productos" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron resultados" });
    }
    console.log(results);
    
    return res.json(results);
  });
};

const createProducto = (req, res) => {
  console.log(req.body);
  
  const {
    nombre_producto,
    imagen_producto,
    precio_producto,
    stock,
    nombre_proveedor,
  } = req.body;

  const consultaProveedor =
    "SELECT id_proveedor FROM PROVEEDORES WHERE nombre_proveedor = ?";

  conection.query(consultaProveedor, [nombre_proveedor], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar proveedor" });
    }

    if (results.length > 0) {
      const consultaProducto =
        "INSERT INTO PRODUCTOS (id_proveedor, imagen_producto, nombre_producto, precio_producto, stock) VALUES (?, ?, ?, ?, ?)";

      conection.query(
        consultaProducto,
        [
          results[0].id_proveedor,
          imagen_producto,
          nombre_producto,
          precio_producto,
          stock,
        ],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error al crear el producto" });
          }

          return res.status(201).json({ message: "Producto creado con éxito" });
        }
      );
    } else {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
  });
};

const updateProducto = (req, res) => {
  const { id } = req.params;
  const {
    nombre_producto,
    imagen_producto,
    precio_producto,
    stock,
    nombre_proveedor,
  } = req.body;
  console.log(req.body)
  console.log(req.params)

  const consultaProveedor =
    "SELECT id_proveedor FROM PROVEEDORES WHERE nombre_proveedor = ?";

  conection.query(consultaProveedor, [nombre_proveedor], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al buscar proveedor" });
    }

    if (results.length > 0) {
      const consultaActualizar =
        "UPDATE PRODUCTOS SET NOMBRE_PRODUCTO = ?, IMAGEN_PRODUCTO = ?, PRECIO_PRODUCTO = ?, STOCK = ?, ID_PROVEEDOR = ? WHERE ID_PRODUCTO = ?";

      conection.query(
        consultaActualizar,
        [
          nombre_producto,
          imagen_producto,
          precio_producto,
          stock,
          results[0].id_proveedor,
          id,
        ],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error al actualizar el producto" });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "Producto no encontrado para actualizar" });
          }

          return res
            .status(200)
            .json({ message: "Producto actualizado con éxito" });
        }
      );
    } else {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
  });
};

const deleteProducto = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE PRODUCTOS SET ESTADO_PRODUCTO = FALSE WHERE ID_PRODUCTO = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al eliminar el producto" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado para eliminar" });
    }

    return res.status(200).json({ message: "Producto eliminado con éxito" });
  });
};

module.exports = {
  getProductos,
  getProducto,
  buscarPorNombre,
  createProducto,
  updateProducto,
  deleteProducto,
};
