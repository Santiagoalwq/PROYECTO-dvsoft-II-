import express from "express"
import cors from "cors"
import clientRoutes from "./routes/clientRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import saleRoutes from "./routes/saleRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"

const app = express()
const PORT = 45678  
const HOST = 'localhost'  

process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

app.use(cors())
app.use(express.json())


import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath))


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})


app.use("/api/clientes", clientRoutes)
app.use("/api/productos", productRoutes)
app.use("/api/ventas", saleRoutes)


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API funcionando correctamente" })
})


app.use(errorHandler)

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('[SERVER] Error iniciando servidor:', err);
    return;
  }
  console.log(`[SERVER] Servidor iniciado en http://${HOST}:${PORT}`);
  console.log(`[SERVER] Prueba la API en: http://${HOST}:${PORT}/test.html`);
});
