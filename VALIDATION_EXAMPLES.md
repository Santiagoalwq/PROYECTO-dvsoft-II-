# Ejemplos de Validaciones

## Cliente Inválido - Email sin @

\`\`\`json
POST /api/clientes
{
  "nombre": "Juan",
  "identificacion": "123",
  "direccion": "Calle 1",
  "telefono": "3001234567",
  "email": "juaninvalid"
}
\`\`\`

Respuesta:
\`\`\`json
{
  "error": "Validación fallida",
  "details": [
    "El email es inválido"
  ]
}
\`\`\`

---

## Producto Inválido - Precio negativo

\`\`\`json
POST /api/productos
{
  "codigo": "PROD001",
  "nombre": "Laptop",
  "descripcion": "Laptop Dell",
  "precio_venta": -1000,
  "costo": 500,
  "cantidad_stock": 10
}
\`\`\`

Respuesta:
\`\`\`json
{
  "error": "Validación fallida",
  "details": [
    "El precio de venta debe ser mayor a 0"
  ]
}
\`\`\`

---

## Venta Inválida - Sin items

\`\`\`json
POST /api/ventas
{
  "cliente_id": 1,
  "items": []
}
\`\`\`

Respuesta:
\`\`\`json
{
  "error": "Validación fallida",
  "details": [
    "Debe agregar al menos un producto a la venta"
  ]
}
\`\`\`

---

## Stock Insuficiente

Si intenta crear una venta con más cantidad que stock:

\`\`\`json
POST /api/ventas
{
  "cliente_id": 1,
  "items": [
    {
      "producto_id": 1,
      "cantidad": 1000
    }
  ]
}
\`\`\`

Respuesta:
\`\`\`json
{
  "error": "Stock insuficiente",
  "status": 409,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
