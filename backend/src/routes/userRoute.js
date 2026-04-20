import express from "express"
import auth from "../middleWares/authMiddleware.js"
import { signUp, login, updateProfile, checkAuth } from '../controllers/authController.js'

const router = express.Router()

// ✅ PUBLIC ROUTES (no auth)
router.post("/signup", signUp)
router.post("/login", login)

// 🔒 PROTECTED ROUTES
router.use(auth)

router.put("/updateProfile", updateProfile)
router.get("/check", checkAuth)

export default router