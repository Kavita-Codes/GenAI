import pdfParse from "pdf-parse"
import generateInterviewReport from "../services/ai.service.js"
import InterviewReport from "../models/interviewReport.model.js"


export async function interviewController(req,res){
       const resumeFile = req.file

       const resumeContent = await (new pdfParse.PDFParse(Unit8Array.from(req.file.buffer)).getText())
       const {selfDescription , jobDescription} = req.body

       const interviewReportByAI = await generateInterviewReport({
              resume:resumeContent,
              selfDescription,
              jobDescription
       })

       const interviewReport = await InterviewReport.create({
              user:req.user.id,
               resume:resumeContent,
              selfDescription,
              jobDescription,
              ...interviewReportByAI
       })

       return res.status(201).json({
              message:"interview report generated successfully",

       })

}