import express from "express"
import { getAllActivities, getSingleUserActivities } from "../controllers/activity.controller.js"

const router = express.Router()

router.get("/", getAllActivities)
router.get("/single-user-activity", getSingleUserActivities)


export default router 