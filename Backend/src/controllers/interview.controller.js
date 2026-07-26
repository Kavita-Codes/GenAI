import generateInterviewReport from "../services/ai.service.js";
import InterviewReport from "../models/interviewReport.model.js";
import { extractTextFromPDF } from "../../utils/extractPDF.js";
import cleanResumeText from "../../utils/cleanResumeText.js";

export async function interviewController(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required", success: false });
    }

    const resumeText = await extractTextFromPDF(resumeFile.buffer);
    console.log(resumeText);
    const cleanedResume = cleanResumeText(resumeText);

    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required", success: false });
    }

    const interviewReportByAI = await generateInterviewReport({
      resume: cleanedResume,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      user: req.user.userId,   // Fixed: was req.user.id but JWT stores userId
      resume: cleanedResume,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      success: true,
      message: "Interview Report Generated",
      data: interviewReport,
    });
  } catch (error) {
    console.error("Interview controller error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

export async function getInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReport.findOne({
      _id: interviewId,
      user: req.user.userId,  // Fixed: was req.user.id
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report found",
      interviewReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

export async function getAllInterviewReportsController(req, res) {
  try {
    // Fixed: was lowercase 'interviewReport' (undefined variable), should be InterviewReport
    const interviewReports = await InterviewReport.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    return res.status(200).json({
      success: true,
      message: "All interview reports found",
      interviewReports,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}
