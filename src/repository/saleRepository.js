import { runQuery, getQuery, allQuery } from "../database/connection.js"

export class SaleRepository {
  static async create(venta) {
    const sql = `
      INSERT INTO ventas (cliente_id, total, subtotal, descuento, impuestos, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const result = await runQuery(sql, [
      venta.cliente_id,
      venta.total,
      venta.subtotal,
      venta.descuento,
      venta.impuestos,
      venta.estado,
    ])
    return result.id
  }

  static async findById(id) {
    const sql = "SELECT * FROM ventas WHERE id = ?"
    return await getQuery(sql, [id])
  }

  static async findAll() {
    const sql = "SELECT * FROM ventas ORDER BY fecha_venta DESC"
    return await allQuery(sql)
  }

  static async addDetail(detalle) {
    const sql = `
      INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `
    return await runQuery(sql, [
      detalle.venta_id,
      detalle.producto_id,
      detalle.cantidad,
      detalle.precio_unitario,
      detalle.subtotal,
    ])
  }

  static async getDetails(venta_id) {
    const sql = `
      SELECT dv.*, p.nombre as producto_nombre 
      FROM detalle_ventas dv
      JOIN productos p ON dv.producto_id = p.id
      WHERE dv.venta_id = ?
    `
    return await allQuery(sql, [venta_id])
  }
}
