import express from "express"
import { getInfo, updateInfo } from "../controllers/webinfo.controller.js"

const router = express.Router()

router.patch("/update", updateInfo)
router.get("/", getInfo)


export default router 