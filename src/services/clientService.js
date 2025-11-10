import { ClientRepository } from "../repository/clientRepository.js"

export class ClientService {
  static async createClient(clientData) {
    if (!clientData.nombre || !clientData.email || !clientData.identificacion) {
      throw new Error("Faltan campos requeridos")
    }
    
    const existing = await ClientRepository.findByEmail(clientData.email)
    if (existing) {
      throw new Error("El email ya está registrado")
    }

    return await ClientRepository.create(clientData)
  }

  static async getAllClients() {
    return await ClientRepository.findAll()
  }

  static async getClientById(id) {
    const client = await ClientRepository.findById(id)
    if (!client) {
      throw new Error("Cliente no encontrado")
    }
    return client
  }

  static async updateClient(id, clientData) {
    const client = await this.getClientById(id)
    return await ClientRepository.update(id, clientData)
  }

  static async deleteClient(id) {
    await this.getClientById(id)
    return await ClientRepository.delete(id)
  }
}
