import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  featurePost,
  updatePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);
router.patch("/update", updatePost);

export default router;
