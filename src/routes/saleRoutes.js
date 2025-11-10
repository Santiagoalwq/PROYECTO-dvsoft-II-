import express from "express"
import { SaleController } from "../controllers/saleController.js"

const router = express.Router()

router.post("/", SaleController.create)
router.get("/", SaleController.getAll)
router.get("/:id", SaleController.getById)

export default router
