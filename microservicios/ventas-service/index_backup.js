const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const CLIENTES_SERVICE_URL = 'http://localhost:3001';
const PRODUCTOS_SERVICE_URL = 'http://localhost:3002';

let ventas = [
  {
    id: 'v1',
    clienteId: 'c1',
    items: [
      { productoId: 'p1', nombre: 'Laptop Dell XPS 13', cantidad: 1, precio: 1299.99 }
    ],
    total: 1299.99,
    metodoPago: 'tarjeta',
    estado: 'completada',
    fecha: new Date('2024-04-01')
  },
  {
    id: 'v2',
    clienteId: 'c2',
    items: [
      { productoId: 'p2', nombre: 'Mouse Logitech MX Master', cantidad: 2, precio: 99.99 }
    ],
    total: 199.98,
    metodoPago: 'efectivo',
    estado: 'completada',
    fecha: new Date('2024-04-05')
  }
];
//validar y detallar producto
async function validarCliente(clienteId) {
  try {
    const response = await axios.post(`${CLIENTES_SERVICE_URL}/clientes/validar/${clienteId}`, {}, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { valido: false, error: error.message };
  }
}

async function validarProducto(productoId, cantidad) {
  try {
    const response = await axios.post(`${PRODUCTOS_SERVICE_URL}/productos/validar/${productoId}`, {
      cantidad
    }, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { valido: false, error: error.message };
  }
}

async function reservarProducto(productoId, cantidad) {
  try {
    const response = await axios.post(`${PRODUCTOS_SERVICE_URL}/productos/reservar/${productoId}`, {
      cantidad
    }, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function liberarProducto(productoId, cantidad) {
  try {
    const response = await axios.post(`${PRODUCTOS_SERVICE_URL}/productos/liberar/${productoId}`, {
      cantidad
    }, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function obtenerDetallesProducto(productoId) {
  try {
    const response = await axios.get(`${PRODUCTOS_SERVICE_URL}/productos/${productoId}`, { timeout: 3000 });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

app.get('/ventas', (req, res) => {
  res.json({
    success: true,
    data: ventas
  });
});

app.get('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const venta = ventas.find(v => v.id === id);

  if (!venta) {
    return res.status(404).json({
      success: false,
      error: `Venta con ID ${id} no encontrada`
    });
  }

  res.json({
    success: true,
    data: venta
  });
});
//validacion 
app.post('/ventas', async (req, res) => {
  try {
    const { clienteId, items, metodoPago } = req.body;

    if (!clienteId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'clienteId e items son requeridos'
      });
    }

    const clienteValidacion = await validarCliente(clienteId);

    if (!clienteValidacion.valido) {
      return res.status(400).json({
        success: false,
        error: clienteValidacion.mensaje || 'Cliente no válido'
      });
    }
//validar y detallar productos
    const itemsDetallados = [];
    let totalVenta = 0;

    for (const item of items) {
      const validacion = await validarProducto(item.productoId, item.cantidad);

      if (!validacion.valido) {
        return res.status(400).json({
          success: false,
          error: validacion.mensaje
        });
      }

      const detalles = await obtenerDetallesProducto(item.productoId);

      if (detalles) {
        itemsDetallados.push({
          productoId: item.productoId,
          nombre: detalles.nombre,
          cantidad: item.cantidad,
          precio: detalles.precio
        });
        totalVenta += detalles.precio * item.cantidad;
      }
    }
//productos reservados
    const productosReservados = [];

    for (const item of itemsDetallados) {
      const reserva = await reservarProducto(item.productoId, item.cantidad);

      if (!reserva.success) {
        for (const productoReservado of productosReservados) {
          await liberarProducto(productoReservado.productoId, productoReservado.cantidad);
        }

        return res.status(400).json({
          success: false,
          error: `No se pudo reservar ${item.nombre}`
        });
      }

      productosReservados.push({
        productoId: item.productoId,
        cantidad: item.cantidad
      });
    }
//nueva venta
    const nuevaVenta = {
      id: uuidv4(),
      clienteId,
      items: itemsDetallados,
      total: totalVenta,
      metodoPago: metodoPago || 'no especificado',
      estado: 'completada',
      fecha: new Date()
    };

    ventas.push(nuevaVenta);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al procesar la venta: ' + error.message
    });
  }
});

app.put('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const venta = ventas.find(v => v.id === id);

  if (!venta) {
    return res.status(404).json({
      success: false,
      error: `Venta con ID ${id} no encontrada`
    });
  }

  if (estado) {
    venta.estado = estado;
  }

  res.json({
    success: true,
    message: 'Venta actualizada exitosamente',
    data: venta
  });
});

app.delete('/ventas/:id', async (req, res) => {
  const { id } = req.params;
  const index = ventas.findIndex(v => v.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Venta con ID ${id} no encontrada`
    });
  }

  const venta = ventas[index];

  for (const item of venta.items) {
    await liberarProducto(item.productoId, item.cantidad);
  }

  ventas.splice(index, 1);

  res.json({
    success: true,
    message: 'Venta cancelada y stock liberado'
  });
});

app.get('/ventas/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  const ventasCliente = ventas.filter(v => v.clienteId === clienteId);

  res.json({
    success: true,
    data: ventasCliente
  });
});

app.get('/reportes/resumen', (req, res) => {
  const totalVentas = ventas.length;
  const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);

  res.json({
    success: true,
    data: {
      totalVentas,
      montoTotal,
      ventaPromedio: totalVentas > 0 ? (montoTotal / totalVentas).toFixed(2) : 0
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Servicio de Ventas activo' });
});

app.listen(PORT, () => {
  console.log(`\n✓ Microservicio de Ventas ejecutándose en puerto ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log('\nEndpoints disponibles:');
  console.log('  GET    /ventas');
  console.log('  GET    /ventas/:id');
  console.log('  POST   /ventas');
  console.log('  PUT    /ventas/:id');
  console.log('  DELETE /ventas/:id');
  console.log('  GET    /ventas/cliente/:clienteId');
  console.log('  GET    /reportes/resumen');
  console.log('  GET    /health\n');
});
