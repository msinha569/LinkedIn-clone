import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createComment, createPosts, deletePost, getFeedPosts, getPostById } from "../controllers/post.controller.js";

const router = Router()

router.get('/',protectRoute, getFeedPosts)
router.post('/create',protectRoute, createPosts)
router.delete('/delete/:id',protectRoute, deletePost)
router.get('/:id',protectRoute,getPostById)
router.post('/:id/comment',protectRoute,createComment)
router.post('/:id/like',protectRoute,likePost)
export default router