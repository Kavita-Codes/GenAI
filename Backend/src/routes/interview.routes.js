import express from "express"
import { authUser } from "../middleware/auth.middleware.js"
import { interviewController } from "../controllers/interview.controller.js"
import upload from "../middleware/file.middleware.js"

const IRouter = express.Router()

IRouter.post("/",authUser , upload.single("resume") , interviewController)

export default IRouter