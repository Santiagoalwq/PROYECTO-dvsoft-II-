import express from "express"
import { ProductController } from "../controllers/productController.js"

const router = express.Router()

router.post("/", ProductController.create)
router.get("/", ProductController.getAll)
router.get("/:id", ProductController.getById)
router.put("/:id", ProductController.update)
router.delete("/:id", ProductController.delete)

export default router
