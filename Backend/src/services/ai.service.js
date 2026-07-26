import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------------- Zod Schema Definition ----------------

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),
  title: z.string().optional().default("Role Interview Assessment"),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focusArea: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

// ---------------- Service Function ----------------

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  if (!resume || !jobDescription) {
    throw new Error("Resume and Job Description are required.");
  }

//   const prompt = `
// You are a Principal Software Engineer and Hiring Committee Member with over 20 years of experience interviewing Software Engineers at top tech companies.

// Analyze the candidate profile and job description provided below, and generate a rigorous interview report.

// ------------------------------------------------------------
// CANDIDATE PROFILE
// ------------------------------------------------------------

// RESUME:
// ${resume}

// SELF DESCRIPTION:
// ${selfDescription || "Not provided"}

// JOB DESCRIPTION:
// ${jobDescription}

// ------------------------------------------------------------
// STRICT OUTPUT REQUIREMENTS (MUST BE VALID JSON)
// ------------------------------------------------------------
// You must return ONLY a valid JSON object. Do NOT wrap it in markdown blockquotes (like \`\`\`json). Do NOT add any conversational text or explanations.

// The JSON structure must strictly follow this exact format:

// {
//   "matchScore": 85,
//   "title": "MERN Stack Developer",
//   "technicalQuestions": [
//     {
//       "question": "Scenario-based technical question text here...",
//       "intention": "What this question evaluates...",
//       "answer": "Detailed breakdown covering engineering concepts, trade-offs, best practices, and production approach..."
//     }
//   ],
//   "behavioralQuestions": [
//     {
//       "question": "Behavioral question text here...",
//       "intention": "Leadership/Ownership evaluation...",
//       "answer": "Situation: ... Task: ... Action: ... Result: ..."
//     }
//   ],
//   "skillGaps": [
//     {
//       "skill": "Skill Name",
//       "severity": "high"
//     }
//   ],
//   "preparationPlan": [
//     {
//       "day": 1,
//       "focusArea": "Core Topic",
//       "tasks": [
//         "Actionable task 1",
//         "Actionable task 2"
//       ],
//     }
//   ]
// } 

// CRITICAL RULES:
// - "title" must be a string containing the exact job role name.
// - technicalQuestions must contain EXACTLY 10 objects.
// - behavioralQuestions must contain EXACTLY 5 objects.
// - skillGaps must contain EXACTLY 5 objects (severity must be strictly: "low", "medium", or "high").
// - preparationPlan must contain EXACTLY 14 objects (Day 1 to 14).
// `;

  // Request text-based output to have full control over JSON parsing and avoid SDK schema mismatches
const prompt = `
You are a Principal Software Engineer and Hiring Committee Member with over 20 years of experience interviewing Software Engineers at top tech companies.

Analyze the candidate profile and job description provided below, and generate a rigorous interview report. Be extremely objective and realistic: if the candidate's resume completely mismatches the job description (for example, a Data Entry resume applying for a MERN Stack / Software Development role), reflect a low, realistic match score (e.g., between 20% to 45%) to clearly highlight the profile gap.

------------------------------------------------------------
CANDIDATE PROFILE
------------------------------------------------------------

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription}

------------------------------------------------------------
STRICT OUTPUT REQUIREMENTS (MUST BE VALID JSON)
------------------------------------------------------------
You must return ONLY a valid JSON object. Do NOT wrap it in markdown blockquotes (like \`\`\`json). Do NOT add any conversational text or explanations.

The JSON structure must strictly follow this exact format:

{
  "matchScore": 35,
  "title": "MERN Stack Developer",
  "technicalQuestions": [
    {
      "question": "Scenario-based technical question text here...",
      "intention": "What this question evaluates...",
      "answer": "Detailed breakdown covering engineering concepts, trade-offs, best practices, and production approach in simple, easy, human-like language..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral question text here...",
      "intention": "Leadership/Ownership evaluation...",
      "answer": "Situation: ... Task: ... Action: ... Result: ..."
    }
  ],
  "skillGaps": [
    {
      "skill": "Simple skill name in easy English (e.g., Missing React and Node.js experience)",
      "severity": "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focusArea": "Core Topic",
      "tasks": [
        "Actionable task 1 with clear, step-by-step guidance",
        "Actionable task 2"
      ]
    }
  ]
} 

CRITICAL RULES:
- "matchScore": Calculate strictly based on how well the resume matches the job description. If fields are completely different (like Data Entry vs Software Development), keep the score low (below 50%).
- "title" must be a string containing the exact job role name from the job description.
- technicalQuestions must contain EXACTLY 25 objects in total, structured progressively: exactly 10 easy beginner-friendly questions, exactly 10 intermediate questions, and exactly 5 hard senior-level questions.
- behavioralQuestions must contain EXACTLY 10 objects covering teamwork, problem-solving, project ownership, and handling pressure, answered in a natural, conversational human style using the STAR method (Situation, Task, Action, Result).
- skillGaps must contain EXACTLY 5 objects written in very simple, plain English (e.g., explaining clearly what skill is missing, like "No experience with coding frameworks like React" or "Lacks database knowledge like MongoDB") with severity strictly as: "low", "medium", or "high".
- preparationPlan must contain EXACTLY 14 objects (Day 1 to 14) with well-defined, practical daily tasks suitable for a balanced preparation journey.
- All technical and behavioral answers must be written in simple, easy, human-like language so that both beginner and experienced candidates can easily understand and explain them in interviews.
`;
  
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
    },
  });

  const rawText = interaction.output_text;
  console.log("Raw AI Output Length:", rawText ? rawText.length : 0);

  let parsedData;
  try {
    // Clean up potential markdown wrappers if the model accidentally includes them
    const cleanJsonText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    parsedData = JSON.parse(cleanJsonText);
  } catch (err) {
    console.error("Failed to parse raw text into JSON:", rawText);
    throw new Error("Failed to parse AI response into JSON: " + err.message);
  }

  // Zod Validation against Mongoose/Zod rules
  const result = interviewReportSchema.parse(parsedData);

  return result;
}

export default generateInterviewReport;