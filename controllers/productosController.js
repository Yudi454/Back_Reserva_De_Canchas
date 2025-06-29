const { conection } = require("../config/database");

const getProductos = (req, res) => {
  const consulta =
    "SELECT id_producto, nombre_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor ";

  conection.query(consulta, (err, results) => {
    if (err) throw err;

    res.json(results);
  });
};

const getProducto = (req, res) => {
  const { id } = req.params;
  const consulta =
    "SELECT id_producto, nombre_producto, precio_producto, stock, nombre_proveedor, telefono_proveedor FROM PRODUCTOS pro JOIN PROVEEDORES pve ON pro.id_proveedor = pve.id_proveedor WHERE pro.id_producto =?";
  conection.query(consulta, [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const createProducto = (req, res) => {
  const { id_proveedor, nombre, precio, stock } = req.body;

  const consulta =
    "INSERT INTO PRODUCTOS (id_proveedor,nombre_producto,precio_producto,stock) values (?,?,?,?)";

  conection.query(
    consulta,
    [id_proveedor, nombre, precio, stock],
    (err, results) => {
      if (err) throw err;
      res.send({ message: "Producto creado con exito" });
    }
  );
};

const updateProducto = (req, res) => {
  const { id } = req.params;
  const { nombre_producto, precio_producto, stock } = req.body;

  const consulta =
    "UPDATE PRODUCTOS SET NOMBRE_PRODUCTO = ?, PRECIO_PRODUCTO = ?, STOCK = ? WHERE ID_PRODUCTO =?";

  conection.query(consulta, [nombre_producto, precio_producto, stock, id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Producto actualizado con exito" });
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
  createProducto,
  updateProducto,
  deleteProducto,
};
