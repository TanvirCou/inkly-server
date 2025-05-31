import express from "express"
import { createContact, getContactInquiries } from "../controllers/contact.controller.js"

const router = express.Router()

router.post("/create", createContact)
router.get("/get", getContactInquiries)


export default router 