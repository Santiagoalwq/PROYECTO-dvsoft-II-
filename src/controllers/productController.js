import { ProductService } from "../services/productService.js"
import { validateProduct } from "../utils/validators.js"

export class ProductController {
  static async create(req, res) {
    try {
      const validation = validateProduct(req.body)
      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validación fallida",
          details: validation.errors,
        })
      }

      const id = await ProductService.createProduct(req.body)
      res.status(201).json({ id, message: "Producto creado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id)
      res.status(200).json(product)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }

  static async update(req, res) {
    try {
      await ProductService.updateProduct(req.params.id, req.body)
      res.status(200).json({ message: "Producto actualizado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async delete(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id)
      res.status(200).json({ message: "Producto eliminado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
