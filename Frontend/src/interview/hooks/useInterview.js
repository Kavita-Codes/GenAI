import { useContext } from 'react';
import { getAllInterviewReports , getInterviewReport , generateInterviewReport as apiGenerateReport } from "../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { report, setReport, loading, setLoading, reports, setReports } = context

    const generateReport = async ({ resumeFile, jobDescription, selfDescription }) => {
        setLoading(true);
        try {
            const response = await apiGenerateReport({ resumeFile, jobDescription, selfDescription });
            // Check backend response structure (whether it's response.data or response.interviewReport)
            const reportData = response.data || response.interviewReport || response;
            setReport(reportData);
            setLoading(false);
            return reportData;
        } catch (error) {
            console.error("Generate report error:", error);
            setLoading(false);
            throw error; // Throw error so frontend component can handle it cleanly instead of crashing
        }
    }

    const getReport = async (interviewId) => {
        setLoading(true);
        try {
            const response = await getInterviewReport(interviewId);
            const reportData = response.interviewReport || response.data || response;
            setReport(reportData);
            setLoading(false);
            return reportData;
        } catch (error) {
            console.error("Get report error:", error);
            setLoading(false);
            throw error;
        }
    }

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            const reportsData = response.interviewReports || response.data || [];
            setReports(reportsData);
            setLoading(false);
            return reportsData;
        } catch (error) {
            console.error("Get reports error:", error);
            setLoading(false);
            throw error;
        }
    }

    return {
        report,
        setReport,
        loading,
        setLoading,
        reports,
        setReports,
        generateReport,
        getReport,
        getReports
    }
}