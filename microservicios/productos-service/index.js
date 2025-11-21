const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

let productos = [
  {
    id: 'p1',
    nombre: 'Laptop Dell XPS 13',
    descripcion: 'Laptop ultraportátil de alta gama',
    precio: 1299.99,
    stock: 15,
    categoria: 'Electrónica',
    sku: 'SKU-001',
    estado: 'disponible'
  },
  {
    id: 'p2',
    nombre: 'Mouse Logitech MX Master',
    descripcion: 'Mouse inalámbrico profesional',
    precio: 99.99,
    stock: 45,
    categoria: 'Accesorios',
    sku: 'SKU-002',
    estado: 'disponible'
  },
  {
    id: 'p3',
    nombre: 'Teclado Mecánico Corsair K95',
    descripcion: 'Teclado mecánico RGB con macros',
    precio: 199.99,
    stock: 22,
    categoria: 'Accesorios',
    sku: 'SKU-003',
    estado: 'disponible'
  },
  {
    id: 'p4',
    nombre: 'Monitor LG UltraWide 34"',
    descripcion: 'Monitor panorámico para productividad',
    precio: 799.99,
    stock: 8,
    categoria: 'Monitores',
    sku: 'SKU-004',
    estado: 'disponible'
  },
  {
    id: 'p5',
    nombre: 'SSD Samsung 970 EVO 1TB',
    descripcion: 'Unidad NVMe de alto rendimiento',
    precio: 129.99,
    stock: 0,
    categoria: 'Almacenamiento',
    sku: 'SKU-005',
    estado: 'agotado'
  }
];

app.get('/productos', (req, res) => {
  res.json({
    success: true,
    data: productos,
    total: productos.length
  });
});

app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      error: `Producto con ID ${id} no encontrado`
    });
  }

  res.json({
    success: true,
    data: producto
  });
});

app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, sku } = req.body;

  if (!nombre || !precio || stock === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, precio y stock son requeridos'
    });
  }

  const nuevoProducto = {
    id: uuidv4(),
    nombre,
    descripcion: descripcion || '',
    precio,
    stock,
    categoria: categoria || 'General',
    sku: sku || `SKU-${Date.now()}`,
    estado: stock > 0 ? 'disponible' : 'agotado'
  };

  productos.push(nuevoProducto);

  res.status(201).json({
    success: true,
    message: 'Producto creado exitosamente',
    data: nuevoProducto
  });
});

app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria, sku, estado } = req.body;

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      error: `Producto con ID ${id} no encontrado`
    });
  }

  if (nombre) producto.nombre = nombre;
  if (descripcion) producto.descripcion = descripcion;
  if (precio !== undefined) producto.precio = precio;
  if (stock !== undefined) {
    producto.stock = stock;
    producto.estado = stock > 0 ? 'disponible' : 'agotado';
  }
  if (categoria) producto.categoria = categoria;
  if (sku) producto.sku = sku;
  if (estado) producto.estado = estado;

  res.json({
    success: true,
    message: 'Producto actualizado exitosamente',
    data: producto
  });
});

app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Producto con ID ${id} no encontrado`
    });
  }

  const productoEliminado = productos.splice(index, 1);

  res.json({
    success: true,
    message: 'Producto eliminado exitosamente',
    data: productoEliminado[0]
  });
});
//validar si un producto existe
app.post('/productos/validar/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.json({
      valido: false,
      mensaje: `Producto ${id} no existe`
    });
  }

  const cantidadRequerida = cantidad || 1;

  if (producto.stock < cantidadRequerida) {
    return res.json({
      valido: false,
      mensaje: `Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidadRequerida}`,
      stockActual: producto.stock
    });
  }

  res.json({
    valido: true,
    mensaje: 'Producto disponible',
    producto: {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock
    }
  });
});
//producto reservar stock
app.post('/productos/reservar/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      error: `Producto ${id} no encontrado`
    });
  }

  if (producto.stock < cantidad) {
    return res.status(400).json({
      success: false,
      error: `Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`
    });
  }

  producto.stock -= cantidad;

  if (producto.stock === 0) {
    producto.estado = 'agotado';
  }

  res.json({
    success: true,
    message: 'Stock reservado exitosamente',
    productoId: id,
    cantidadReservada: cantidad,
    stockRestante: producto.stock
  });
});
//producto liberar stock
app.post('/productos/liberar/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      error: `Producto ${id} no encontrado`
    });
  }

  producto.stock += cantidad;

  if (producto.stock > 0) {
    producto.estado = 'disponible';
  }

  res.json({
    success: true,
    message: 'Stock liberado exitosamente',
    productoId: id,
    cantidadLiberada: cantidad,
    stockActual: producto.stock
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Servicio de Productos activo' });
});

app.listen(PORT, () => {
  console.log(`\n✓ Microservicio de Productos ejecutándose en puerto ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log('\nEndpoints disponibles:');
  console.log('  GET    /productos');
  console.log('  GET    /productos/:id');
  console.log('  POST   /productos');
  console.log('  PUT    /productos/:id');
  console.log('  DELETE /productos/:id');
  console.log('  POST   /productos/validar/:id');
  console.log('  POST   /productos/reservar/:id');
  console.log('  POST   /productos/liberar/:id');
  console.log('  GET    /health\n');
});

module.exports = app;
