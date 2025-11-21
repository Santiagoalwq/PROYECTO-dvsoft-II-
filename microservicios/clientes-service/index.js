const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let clientes = [
  {
    id: 'c1',
    nombre: 'Juan García',
    email: 'juan@example.com',
    telefono: '555-1234',
    direccion: 'Calle Principal 123',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-15')
  },
  {
    id: 'c2',
    nombre: 'María López',
    email: 'maria@example.com',
    telefono: '555-5678',
    direccion: 'Avenida Central 456',
    estado: 'activo',
    fechaRegistro: new Date('2024-02-20')
  },
  {
    id: 'c3',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    telefono: '555-9012',
    direccion: 'Paseo de la República 789',
    estado: 'activo',
    fechaRegistro: new Date('2024-03-10')
  }
];

app.get('/clientes', (req, res) => {
  res.json({
    success: true,
    data: clientes,
    total: clientes.length
  });
});

app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({
      success: false,
      error: `Cliente con ID ${id} no encontrado`
    });
  }

  res.json({
    success: true,
    data: cliente
  });
});

app.post('/clientes', (req, res) => {
  const { nombre, email, telefono, direccion } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      error: 'El nombre y email son requeridos'
    });
  }

  const nuevoCliente = {
    id: uuidv4(),
    nombre,
    email,
    telefono: telefono || '',
    direccion: direccion || '',
    estado: 'activo',
    fechaRegistro: new Date()
  };

  clientes.push(nuevoCliente);

  res.status(201).json({
    success: true,
    message: 'Cliente creado exitosamente',
    data: nuevoCliente
  });
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion, estado } = req.body;

  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({
      success: false,
      error: `Cliente con ID ${id} no encontrado`
    });
  }

  if (nombre) cliente.nombre = nombre;
  if (email) cliente.email = email;
  if (telefono) cliente.telefono = telefono;
  if (direccion) cliente.direccion = direccion;
  if (estado) cliente.estado = estado;

  res.json({
    success: true,
    message: 'Cliente actualizado exitosamente',
    data: cliente
  });
});

app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Cliente con ID ${id} no encontrado`
    });
  }

  const clienteEliminado = clientes.splice(index, 1);

  res.json({
    success: true,
    message: 'Cliente eliminado exitosamente',
    data: clienteEliminado[0]
  });
});
//validar si un cliente existe
app.post('/clientes/validar/:id', (req, res) => {
  const { id } = req.params;
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.json({
      valido: false,
      mensaje: `Cliente ${id} no existe`
    });
  }

  res.json({
    valido: true,
    cliente: {
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      estado: cliente.estado
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Servicio de Clientes activo' });
});

app.listen(PORT, () => {
  console.log(`\n✓ Microservicio de Clientes ejecutándose en puerto ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log('\nEndpoints disponibles:');
  console.log('  GET    /clientes');
  console.log('  GET    /clientes/:id');
  console.log('  POST   /clientes');
  console.log('  PUT    /clientes/:id');
  console.log('  DELETE /clientes/:id');
  console.log('  POST   /clientes/validar/:id');
  console.log('  GET    /health\n');
});

module.exports = app;
