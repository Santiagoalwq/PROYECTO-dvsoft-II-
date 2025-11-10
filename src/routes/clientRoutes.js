import express from "express"
import { ClientController } from "../controllers/clientController.js"

const router = express.Router()

router.post("/", ClientController.create)
router.get("/", ClientController.getAll)
router.get("/:id", ClientController.getById)
router.put("/:id", ClientController.update)
router.delete("/:id", ClientController.delete)

export default router
