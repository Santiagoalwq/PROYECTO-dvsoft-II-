const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

let ventas = [
  {
    id: 'v1',
    clienteId: 'c1',
    items: [ { productoId: 'p1', nombre: 'Laptop Dell XPS 13', cantidad: 1, precio: 1299.99 } ],
    total: 1299.99,
    metodoPago: 'tarjeta',
    estado: 'completada',
    fecha: new Date('2024-04-01')
  },
  {
    id: 'v2',
    clienteId: 'c2',
    items: [ { productoId: 'p2', nombre: 'Mouse Logitech MX Master', cantidad: 2, precio: 99.99 } ],
    total: 199.98,
    metodoPago: 'efectivo',
    estado: 'completada',
    fecha: new Date('2024-04-05')
  }
];

app.get('/ventas', (req, res) => {
  res.json({ success: true, data: ventas, total: ventas.length });
});

app.get('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const venta = ventas.find(v => v.id === id);
  if (!venta) return res.status(404).json({ success: false, error: `Venta con ID ${id} no encontrada` });
  res.json({ success: true, data: venta });
});

app.post('/ventas', (req, res) => {
  const { clienteId, items, metodoPago } = req.body;
  if (!clienteId || !items || items.length === 0) return res.status(400).json({ success: false, error: 'clienteId e items son requeridos' });
  let total = 0;
  for (const it of items) total += (it.precio || 0) * (it.cantidad || 0);
  const nuevaVenta = { id: uuidv4(), clienteId, items, total, metodoPago: metodoPago || 'no especificado', estado: 'completada', fecha: new Date() };
  ventas.push(nuevaVenta);
  res.status(201).json({ success: true, message: 'Venta creada exitosamente', data: nuevaVenta });
});

app.put('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const venta = ventas.find(v => v.id === id);
  if (!venta) return res.status(404).json({ success: false, error: `Venta con ID ${id} no encontrada` });
  if (estado) venta.estado = estado;
  res.json({ success: true, message: 'Venta actualizada exitosamente', data: venta });
});

app.delete('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const index = ventas.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: `Venta con ID ${id} no encontrada` });
  const ventaEliminada = ventas.splice(index, 1);
  res.json({ success: true, message: 'Venta eliminada exitosamente', data: ventaEliminada[0] });
});

app.get('/ventas/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  const ventasCliente = ventas.filter(v => v.clienteId === clienteId);
  res.json({ success: true, data: ventasCliente, total: ventasCliente.length });
});

app.get('/reportes/resumen', (req, res) => {
  const totalVentas = ventas.length;
  const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);
  res.json({ success: true, data: { totalVentas, montoTotal, ventaPromedio: totalVentas > 0 ? (montoTotal / totalVentas).toFixed(2) : 0 } });
});

app.get('/health', (req, res) => res.json({ status: 'Servicio de Ventas activo' }));

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

module.exports = app;
