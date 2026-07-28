import express from "express"
import { authUser } from "../middleware/auth.middleware.js"
import { generateResumePdfController, getAllInterviewReportsController, getInterviewReportController, interviewController } from "../controllers/interview.controller.js"
import upload from "../middleware/file.middleware.js"

const IRouter = express.Router()

IRouter.post("/",authUser , upload.single("resume") , interviewController)
IRouter.get("/report/:interviewId" , authUser , getInterviewReportController)
IRouter.get("/" , authUser , getAllInterviewReportsController)
IRouter.post('/interview-report/:interviewReportId/pdf', authUser, generateResumePdfController);




export default IRouter