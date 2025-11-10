import { ClientService } from "../services/clientService.js"
import { validateClient } from "../utils/validators.js"

export class ClientController {
  static async create(req, res) {
    try {
      const validation = validateClient(req.body)
      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validación fallida",
          details: validation.errors,
        })
      }

      const id = await ClientService.createClient(req.body)
      res.status(201).json({ id, message: "Cliente creado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async getAll(req, res) {
    try {
      const clients = await ClientService.getAllClients()
      res.status(200).json(clients)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const client = await ClientService.getClientById(req.params.id)
      res.status(200).json(client)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }

  static async update(req, res) {
    try {
      await ClientService.updateClient(req.params.id, req.body)
      res.status(200).json({ message: "Cliente actualizado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async delete(req, res) {
    try {
      await ClientService.deleteClient(req.params.id)
      res.status(200).json({ message: "Cliente eliminado exitosamente" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
