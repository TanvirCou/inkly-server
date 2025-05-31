import express from "express"
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.js"

const router = express.Router()

router.post("/create", createCategory)
router.get("/get", getCategories)
router.delete("/:id", deleteCategory)


export default router 