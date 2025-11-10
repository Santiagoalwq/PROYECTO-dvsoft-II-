import { runQuery, getQuery, allQuery } from "../database/connection.js"

export class ClientRepository {
  static async create(cliente) {
    const sql = `
      INSERT INTO clientes (nombre, identificacion, direccion, telefono, email)
      VALUES (?, ?, ?, ?, ?)
    `
    const result = await runQuery(sql, [
      cliente.nombre,
      cliente.identificacion,
      cliente.direccion,
      cliente.telefono,
      cliente.email,
    ])
    return result.id
  }

  static async findById(id) {
    const sql = "SELECT * FROM clientes WHERE id = ?"
    return await getQuery(sql, [id])
  }

  static async findAll() {
    const sql = "SELECT * FROM clientes ORDER BY fecha_registro DESC"
    return await allQuery(sql)
  }

  static async update(id, cliente) {
    const sql = `
      UPDATE clientes 
      SET nombre = ?, identificacion = ?, direccion = ?, telefono = ?, email = ?
      WHERE id = ?
    `
    return await runQuery(sql, [
      cliente.nombre,
      cliente.identificacion,
      cliente.direccion,
      cliente.telefono,
      cliente.email,
      id,
    ])
  }

  static async delete(id) {
    const sql = "DELETE FROM clientes WHERE id = ?"
    return await runQuery(sql, [id])
  }

  static async findByEmail(email) {
    const sql = "SELECT * FROM clientes WHERE email = ?"
    return await getQuery(sql, [email])
  }
}
