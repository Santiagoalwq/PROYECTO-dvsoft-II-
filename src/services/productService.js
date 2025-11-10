import { ProductRepository } from "../repository/productRepository.js"

export class ProductService {
  static async createProduct(productData) {
    if (!productData.codigo || !productData.nombre || !productData.precio_venta) {
      throw new Error("Faltan campos requeridos")
    }

    return await ProductRepository.create(productData)
  }

  static async getAllProducts() {
    return await ProductRepository.findAll()
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    return product
  }

  static async updateProduct(id, productData) {
    await this.getProductById(id)
    return await ProductRepository.update(id, productData)
  }

  static async deleteProduct(id) {
    await this.getProductById(id)
    return await ProductRepository.delete(id)
  }

  static async checkStock(id, cantidad) {
    const product = await this.getProductById(id)
    if (product.cantidad_stock < cantidad) {
      throw new Error("Stock insuficiente")
    }
    return true
  }
}
