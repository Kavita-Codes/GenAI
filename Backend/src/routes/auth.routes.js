import express from "express"
import { getMeController, loginController, logoutController, registerController } from "../controllers/auth.controller.js"
import { authUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/register" , registerController)
router.post("/login" , loginController)
router.delete("/logout" , logoutController)
router.get("/get-me" , authUser, getMeController)



export default router