import { SaleService } from "../services/saleService.js"
import { validateSale } from "../utils/validators.js"

export class SaleController {
  static async create(req, res) {
    try {
      const validation = validateSale(req.body)
      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validación fallida",
          details: validation.errors,
        })
      }

      const id = await SaleService.createSale(req.body)
      res.status(201).json({ id, message: "Venta creada exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async getAll(req, res) {
    try {
      const sales = await SaleService.getAllSales()
      res.status(200).json(sales)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const sale = await SaleService.getSaleById(req.params.id)
      res.status(200).json(sale)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
}
