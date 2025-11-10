# Guía de Endpoints - Sistema de Ventas

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## CLIENTES

### 1. Crear Cliente
**POST** `/clientes`

Body (JSON):
\`\`\`json
{
  "nombre": "Juan Pérez",
  "identificacion": "1234567890",
  "direccion": "Calle 10 #20-30",
  "telefono": "3001234567",
  "email": "juan@example.com"
}
\`\`\`

### 2. Obtener Todos los Clientes
**GET** `/clientes`

Respuesta:
\`\`\`json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "identificacion": "1234567890",
    "direccion": "Calle 10 #20-30",
    "telefono": "3001234567",
    "email": "juan@example.com",
    "fecha_registro": "2024-01-15 10:30:00"
  }
]
\`\`\`

### 3. Obtener Cliente por ID
**GET** `/clientes/1`

### 4. Actualizar Cliente
**PUT** `/clientes/1`

Body (JSON):
\`\`\`json
{
  "nombre": "Juan Carlos Pérez",
  "identificacion": "1234567890",
  "direccion": "Calle 15 #10-20",
  "telefono": "3009876543",
  "email": "juan@example.com"
}
\`\`\`

### 5. Eliminar Cliente
**DELETE** `/clientes/1`

---

## PRODUCTOS

### 1. Crear Producto
**POST** `/productos`

Body (JSON):
\`\`\`json
{
  "codigo": "PROD001",
  "nombre": "Laptop Dell",
  "descripcion": "Laptop Dell Inspiron 15",
  "precio_venta": 1200000,
  "costo": 900000,
  "cantidad_stock": 10
}
\`\`\`

### 2. Obtener Todos los Productos
**GET** `/productos`

### 3. Obtener Producto por ID
**GET** `/productos/1`

### 4. Actualizar Producto
**PUT** `/productos/1`

Body (JSON):
\`\`\`json
{
  "codigo": "PROD001",
  "nombre": "Laptop Dell",
  "descripcion": "Laptop Dell Inspiron 15",
  "precio_venta": 1250000,
  "costo": 900000,
  "cantidad_stock": 8
}
\`\`\`

### 5. Eliminar Producto
**DELETE** `/productos/1`

---

## VENTAS

### 1. Crear Venta
**POST** `/ventas`

Body (JSON):
\`\`\`json
{
  "cliente_id": 1,
  "descuento": 50000,
  "items": [
    {
      "producto_id": 1,
      "cantidad": 2
    },
    {
      "producto_id": 2,
      "cantidad": 1
    }
  ]
}
\`\`\`

Respuesta:
\`\`\`json
{
  "id": 1,
  "message": "Venta creada exitosamente"
}
\`\`\`

### 2. Obtener Todas las Ventas
**GET** `/ventas`

### 3. Obtener Venta por ID (con detalles)
**GET** `/ventas/1`

Respuesta:
\`\`\`json
{
  "id": 1,
  "cliente_id": 1,
  "total": 2390000,
  "subtotal": 2440000,
  "descuento": 50000,
  "impuestos": 463200,
  "fecha_venta": "2024-01-15 11:00:00",
  "estado": "completada",
  "items": [
    {
      "id": 1,
      "venta_id": 1,
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 1200000,
      "subtotal": 2400000,
      "producto_nombre": "Laptop Dell"
    }
  ]
}
\`\`\`

---

## Verificar Estado del Servidor
**GET** `/health`

Respuesta:
\`\`\`json
{
  "status": "OK",
  "message": "API funcionando correctamente"
}
