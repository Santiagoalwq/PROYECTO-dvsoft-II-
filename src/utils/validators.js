export function validateClient(cliente) {
  const errors = []

  if (!cliente.nombre || cliente.nombre.trim() === "") {
    errors.push("El nombre es requerido")
  }

  if (!cliente.email || !cliente.email.includes("@")) {
    errors.push("El email es inválido")
  }

  if (!cliente.identificacion || cliente.identificacion.trim() === "") {
    errors.push("La identificación es requerida")
  }

  if (!cliente.telefono || cliente.telefono.trim() === "") {
    errors.push("El teléfono es requerido")
  }

  if (!cliente.direccion || cliente.direccion.trim() === "") {
    errors.push("La dirección es requerida")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateProduct(producto) {
  const errors = []

  if (!producto.codigo || producto.codigo.trim() === "") {
    errors.push("El código del producto es requerido")
  }

  if (!producto.nombre || producto.nombre.trim() === "") {
    errors.push("El nombre del producto es requerido")
  }

  if (!producto.precio_venta || producto.precio_venta <= 0) {
    errors.push("El precio de venta debe ser mayor a 0")
  }

  if (!producto.costo || producto.costo <= 0) {
    errors.push("El costo debe ser mayor a 0")
  }

  if (producto.cantidad_stock < 0) {
    errors.push("El stock no puede ser negativo")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateSale(venta) {
  const errors = []

  if (!venta.cliente_id) {
    errors.push("El cliente es requerido")
  }

  if (!venta.items || venta.items.length === 0) {
    errors.push("Debe agregar al menos un producto a la venta")
  }

  if (venta.items) {
    venta.items.forEach((item, index) => {
      if (!item.producto_id) {
        errors.push(`Item ${index + 1}: El producto es requerido`)
      }
      if (!item.cantidad || item.cantidad <= 0) {
        errors.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
