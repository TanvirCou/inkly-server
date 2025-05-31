import express from "express"
import { getAdmins, getAllUsers, getUser, getUserSavedPosts, makeAdmin, removeFromAdmin, savePost, updateUser } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.patch("/update", updateUser)
router.patch("/makeAdmin", makeAdmin)
router.patch("/removeAdmin", removeFromAdmin)
router.get("/admins", getAdmins)
router.get("/", getUser)
router.get("/all-users", getAllUsers)


export default router 