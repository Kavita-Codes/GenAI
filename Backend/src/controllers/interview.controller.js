import pdfParse from "pdf-parse"


export async function interviewController(req,res){
       const resumeFile = req.file

       const resumeContent = pdfParse(req.file.buffer)
       const {selfDescription , jobDescription} = req.body
}