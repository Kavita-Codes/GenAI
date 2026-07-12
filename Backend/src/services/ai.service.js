import { GoogleGenAI } from "@google/genai";
import {z} from "zod"
import {zodToJsonSchema} from "zod-to-json-schema"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


/**
 * Zod schema defining the strict structure for the AI-generated interview report.
 * This guarantees type safety and matches the required output shape for the database/frontend.
 */

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("A quantitative score between 0 and 100 indicating how well the candidate's profile aligns with the job description."),
  
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("A targeted technical or system design question relevant to the tech stack in the job description."),
      intention: z.string().describe("The core competency or underlying concept the interviewer is testing."),
      answer: z.string().describe("A comprehensive blueprint on how to structure the answer, covering key technical terms, trade-offs, and edge cases.")
    })
  ).describe("Crucial technical questions with detailed evaluation strategy."),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("A situational or behavioral question testing culture fit, leadership, or conflict resolution."),
      intention: z.string().describe("The specific soft skill or core value being evaluated."),
      answer: z.string().describe("A step-by-step guide on how to answer this using the STAR methodology (Situation, Task, Action, Result).")
    })
  ).describe("Behavioral questions with STAR-method breakdown."),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The specific technical or domain skill the candidate is missing or weak in."),
      severity: z.enum(["low", "medium", "high"]).describe("The criticality of this gap for the target role.")
    })
  ).describe("Identified skill gaps requiring immediate upskilling."),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The sequential day number in the study plan, starting from 1."),
      focus: z.string().describe("The core technical or practical theme for the day."),
      tasks: z.array(z.string()).describe("Actionable, hands-on tasks or concepts to master on this specific day.")
    })
  ).describe("A structured, day-wise preparation roadmap.")
});

async function generateInterviewReport(resume, selfDescription, jobDescription) {
    if (!resume || !jobDescription) {
    throw new Error("Resume and Job Description are mandatory for generating an interview report.");
  }


  // High-impact system instruction for the LLM
 const systemInstruction = `
You are a Principal Engineering Interviewer. 
Your output must adhere to these professional standards:

1. TECHNICAL DEPTH: Do not ask basic syntax questions. Ask about 'Trade-offs'. 
   (e.g., instead of 'What is Redux?', ask 'When should you choose React Context vs Redux for state management, and what are the performance implications?')
2. BEHAVIORAL PRECISION: Every behavioral answer must follow the STAR format (Situation, Task, Action, Result). 
   Focus on 'Result'—use metrics or specific business impact (e.g., 'Reduced latency by 20%').
3. GAP ANALYSIS: Be specific. If a gap is 'System Design', suggest learning 'Load Balancing' or 'Database Sharding'.
4. ACTIONABLE PATH: The preparation plan should be a 14-day roadmap where Day 1-3 is 'Fundamentals', Day 4-9 is 'Core Tech/Projects', and Day 10-14 is 'Mock Interviews/System Design'.
`;

  const prompt = `
    Analyze the following profile for the job role:
    RESUME: ${resume}
    CANDIDATE DESCRIPTION: ${selfDescription}
    JOB DESCRIPTION: ${jobDescription}
    
    Provide a detailed interview report based on the provided schema.
  `;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash", // Using latest stable model
//     contents: prompt,
//     config: {
//       systemInstruction: systemInstruction,
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(interviewReportSchema),
//     },
//   });

//   return JSON.parse(response.text());

 try {
    // Calling Gemini using the recommended structured output configuration
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using latest stable production model
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        // Convert Zod schema to standard JSON schema for Gemini config
        responseSchema: zodToJsonSchema(interviewReportSchema),
      //   temperature: 0.3, // Lower temperature for more factual and analytical results
      },
    });

    const rawOutput = response.text;
    if (!rawOutput) {
      throw new Error("No response received from the Gemini model.");
    }

    // Parse and validate the response against the Zod schema
    const parsedData = JSON.parse(rawOutput);
    const validatedReport = interviewReportSchema.parse(parsedData);

    return validatedReport;

  } catch (error) {
    console.error("Error generating or validating interview report:", error);
    throw new Error(`AI Service Failure: ${error.message}`);
  }
}

export default generateInterviewReport
