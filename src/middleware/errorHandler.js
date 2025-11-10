export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message)

  
  if (err.message && err.message.includes("Faltan")) {
    return res.status(400).json({
      error: err.message,
      status: 400,
      timestamp: new Date().toISOString(),
    })
  }

  
  if (err.message && err.message.includes("no encontrado")) {
    return res.status(404).json({
      error: err.message,
      status: 404,
      timestamp: new Date().toISOString(),
    })
  }

  
  if (err.message && err.message.includes("Stock insuficiente")) {
    return res.status(409).json({
      error: err.message,
      status: 409,
      timestamp: new Date().toISOString(),
    })
  }

  
  if (err.message && err.message.includes("ya está registrado")) {
    return res.status(409).json({
      error: err.message,
      status: 409,
      timestamp: new Date().toISOString(),
    })
  }

  
  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
    status: 500,
    timestamp: new Date().toISOString(),
  })
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
