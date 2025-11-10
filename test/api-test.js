import fetch from 'node-fetch';

async function testAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('\n1. Creando cliente...');
  const clienteRes = await fetch(`${baseURL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: "Juan Perez",
      identificacion: "12345678",
      direccion: "Calle 123",
      telefono: "3001234567",
      email: "juan@test.com"
    })
  });
  const cliente = await clienteRes.json();
  console.log('Cliente creado:', cliente);
  
  console.log('\n2. Creando producto...');
  const productoRes = await fetch(`${baseURL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo: "P001",
      nombre: "Laptop",
      descripcion: "Laptop gaming",
      precio_venta: 1200.00,
      costo: 1000.00,
      cantidad_stock: 10
    })
  });
  const producto = await productoRes.json();
  console.log('Producto creado:', producto);
  
  console.log('\n3. Registrando venta...');
  const ventaRes = await fetch(`${baseURL}/ventas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente_id: cliente.id,
      items: [{ 
        producto_id: producto.id,
        cantidad: 2
      }],
      descuento: 0
    })
  });
  const venta = await ventaRes.json();
  console.log('Venta registrada:', venta);
  
  console.log('\n4. Verificando stock actualizado...');
  const stockRes = await fetch(`${baseURL}/productos/${producto.id}`);
  const productoActualizado = await stockRes.json();
  console.log('Stock actual:', productoActualizado.cantidad_stock);
}

testAPI().catch(console.error);