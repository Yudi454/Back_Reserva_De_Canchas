const conection = require("../config/database");

const getProductos = (req, res) => {
  const consulta =
    "SELECT id_producto, nombre_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE estado_producto = true ORDER BY pro.id_producto ";

  conection.query(consulta, (err, results) => {
    if (err) throw err;

    res.json(results);
  });
};

const getProducto = (req, res) => {
  const { id } = req.params;
  const consulta =
    "SELECT id_producto, nombre_producto, imagen_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE pro.id_producto =?";
  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    const data = results[0];
    res.json({
      results: {
        id_producto: data.id_producto,
        nombre_producto: data.nombre_producto,
        precio_producto: data.precio_producto,
        stock: data.stock,
        nombre_proveedor: data.nombre_proveedor,
        imagen: data.imagen_producto
      },
    });
  });
};

const buscarPorNombre = (req, res) => {
  const { nombre_producto } = req.body;

  const consulta =
    "SELECT pro.id_producto, pro.nombre_producto, pro.precio_producto, pro.stock, pro.imagen_producto, pve.nombre_proveedor, pve.telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE estado_producto = true AND pro.nombre_producto LIKE ? ORDER BY pro.id_producto ";

  conection.query(consulta, [`%${nombre_producto}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const createProducto = (req, res) => {
  const { nombre_producto, imagen_producto, precio_producto, stock, nombre_proveedor } =
  req.body; 
  const consulta =
    "SELECT id_proveedor FROM PROVEEDORES WHERE nombre_proveedor = ? ";

  conection.query(consulta, [nombre_proveedor], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const consulta =
        "INSERT INTO PRODUCTOS (id_proveedor,imagen_producto, nombre_producto,precio_producto,stock) values (?,?,?,?)";

      conection.query(
        consulta,
        [results[0].id_proveedor, imagen_producto, nombre_producto, precio_producto, stock],
        (err, results) => {
          if (err) throw err;

          res.send({ message: "Producto creado con exito" });
        }
      );
    } else {
      res.status(404).send({ message: "Proveedor no encontrado" });
    }
  });
};

const updateProducto = (req, res) => {
  const { id } = req.params;
  const { nombre_producto,imagen_producto, precio_producto, stock, nombre_proveedor } =
    req.body;

  const consulta =
    "SELECT id_proveedor FROM PROVEEDORES WHERE nombre_proveedor = ?";

  conection.query(consulta, [nombre_proveedor], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const consulta =
        "UPDATE PRODUCTOS SET NOMBRE_PRODUCTO = ?, IMAGEN_PRODUCTO = ?, PRECIO_PRODUCTO = ?, STOCK = ?, ID_PROVEEDOR = ? WHERE ID_PRODUCTO =?";

      conection.query(
        consulta,
        [nombre_producto, imagen_producto, precio_producto, stock, results[0].id_proveedor, id],
        (err, results) => {
          if (err) throw err;
          res.send({ message: "Producto actualizado con exito" });
        }
      );
    } else {
      res.status(404).send({ message: "Proveedor no encontrado" });
    }
  });
};

const deleteProducto = (req, res) => {
  const { id } = req.params;

  const consulta =
    "UPDATE PRODUCTOS SET ESTADO_PRODUCTO = FALSE WHERE ID_PRODUCTO = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Producto eliminado con exito" });
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
