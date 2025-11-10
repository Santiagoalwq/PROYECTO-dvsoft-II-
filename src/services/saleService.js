import { SaleRepository } from "../repository/saleRepository.js"
import { ProductService } from "./productService.js"
import { ClientService } from "./clientService.js"
import { ProductRepository } from "../repository/productRepository.js"

export class SaleService {
  static async createSale(saleData) {
    await ClientService.getClientById(saleData.cliente_id)

    let subtotal = 0
    for (const item of saleData.items) {  
      const product = await ProductService.getProductById(item.producto_id)
      await ProductService.checkStock(item.producto_id, item.cantidad)
      subtotal += product.precio_venta * item.cantidad
    }

    const impuestos = subtotal * 0.19
    const total = subtotal + impuestos
    const saleId = await SaleRepository.create({
      cliente_id: saleData.cliente_id,
      subtotal,
      impuestos,
      descuento: saleData.descuento || 0,
      total: total - (saleData.descuento || 0),
      estado: "completada",
    })

    for (const item of saleData.items) {
      const product = await ProductService.getProductById(item.producto_id)
      await SaleRepository.addDetail({
        venta_id: saleId,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: product.precio_venta,
        subtotal: product.precio_venta * item.cantidad,
      })

      await ProductRepository.updateStock(item.producto_id, -item.cantidad)
    }

    return saleId
  }

  static async getSaleById(id) {
    const sale = await SaleRepository.findById(id)
    if (!sale) {
      throw new Error("Venta no encontrada")
    }
    const details = await SaleRepository.getDetails(id)
    return { ...sale, items: details }
  }

  static async getAllSales() {
    return await SaleRepository.findAll()
  }
}
