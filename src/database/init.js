import sqlite3 from "sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "ventas.db")

async function initDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error abriendo BD:", err)
    else console.log("[DB] Conectado a SQLite")
  })

  db.run(
    `
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      identificacion TEXT UNIQUE NOT NULL,
      direccion TEXT NOT NULL,
      telefono TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creando tabla clientes:", err)
      else console.log("[DB] Tabla clientes lista")
    },
  )

  db.run(
    `
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio_venta REAL NOT NULL,
      costo REAL NOT NULL,
      cantidad_stock INTEGER NOT NULL DEFAULT 0,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creando tabla productos:", err)
      else console.log("[DB] Tabla productos lista")
    },
  )

  db.run(
    `
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      total REAL NOT NULL,
      subtotal REAL NOT NULL,
      descuento REAL DEFAULT 0,
      impuestos REAL NOT NULL,
      fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
      estado TEXT DEFAULT 'completada',
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `,
    (err) => {
      if (err) console.error("Error creando tabla ventas:", err)
      else console.log("[DB] Tabla ventas lista")
    },
  )

  db.run(
    `
    CREATE TABLE IF NOT EXISTS detalle_ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES ventas(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `,
    (err) => {
      if (err) console.error("Error creando tabla detalle_ventas:", err)
      else console.log("[DB] Tabla detalle_ventas lista")
    },
  )

  db.close(() => {
    console.log("[DB] Base de datos inicializada correctamente")
  })
}

initDatabase()
