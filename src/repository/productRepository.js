import { runQuery, getQuery, allQuery } from "../database/connection.js"

export class ProductRepository {
  static async create(producto) {
    const sql = `
      INSERT INTO productos (codigo, nombre, descripcion, precio_venta, costo, cantidad_stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const result = await runQuery(sql, [
      producto.codigo,
      producto.nombre,
      producto.descripcion,
      producto.precio_venta,
      producto.costo,
      producto.cantidad_stock,
    ])
    return result.id
  }

  static async findById(id) {
    const sql = "SELECT * FROM productos WHERE id = ?"
    return await getQuery(sql, [id])
  }

  static async findAll() {
    const sql = "SELECT * FROM productos ORDER BY fecha_registro DESC"
    return await allQuery(sql)
  }

  static async update(id, producto) {
    const sql = `
      UPDATE productos 
      SET codigo = ?, nombre = ?, descripcion = ?, precio_venta = ?, costo = ?, cantidad_stock = ?
      WHERE id = ?
    `
    return await runQuery(sql, [
      producto.codigo,
      producto.nombre,
      producto.descripcion,
      producto.precio_venta,
      producto.costo,
      producto.cantidad_stock,
      id,
    ])
  }

  static async delete(id) {
    const sql = "DELETE FROM productos WHERE id = ?"
    return await runQuery(sql, [id])
  }

  static async updateStock(id, cantidad) {
    const sql = "UPDATE productos SET cantidad_stock = cantidad_stock + ? WHERE id = ?"
    return await runQuery(sql, [cantidad, id])
  }
}
