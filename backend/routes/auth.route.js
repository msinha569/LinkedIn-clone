import { Router } from "express";
import { getUser, login, logout, refreshAccessToken, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/refresh',refreshAccessToken)

router.get('/me', protectRoute,getUser)
export default router