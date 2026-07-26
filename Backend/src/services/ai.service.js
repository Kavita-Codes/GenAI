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

// 1. Puppeteer Function (jaise screenshot mein hai)
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    
    await browser.close();
    
    return pdfBuffer;
}

// 2. Gemini HTML Generation Function
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string()
    });

  const prompt = `
You are an expert Technical Recruiter, Principal Software Engineer, and Professional PDF Designer with over 20 years of experience.

Analyze the candidate profile and job description provided below, and generate a clean, professional, and beautifully structured HTML string for an A4 Interview Report.

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
You must return ONLY a valid JSON object matching the following Zod schema structure, containing a single field "html". Do NOT wrap it in markdown blockquotes (like \`\`\`json). Do NOT add any conversational text.

{
  "html": "<!DOCTYPE html><html><head><style>/* CSS Styles here */</style></head><body>...</body></html>"
}

------------------------------------------------------------
DESIGN & FORMATTING RULES FOR THE HTML STRING:
------------------------------------------------------------
1. **A4 Fit & Layout:** The HTML must be specifically styled to fit cleanly onto a **Single A4 Page** (approx width: 210mm, min-height: 297mm) without messy page overflows. Use compact yet readable spacing, clean typography (e.g., system fonts like Inter, Roboto, or Arial), and structured grid/flex elements.
2. **Padding & Margins:** Include proper container padding (e.g., 20mm or 24px-32px margins/padding inside the body) so content never touches the edges of the PDF.
3. **Professional Theme:** Use a sleek modern corporate or tech UI theme (clean whites, dark grey text, subtle primary accent colors like deep indigo or slate blue, soft card backgrounds, and colored badges for match score or skill gap severities).
4. **Report Content Structure to Include:**
   - **Header:** Role title, target position name, and Match Score badge.
   - **Summary Section:** Brief evaluation of the candidate against the job description.
   - **Key Skill Gaps:** Clear, simple English bullet points showing missing areas.
   - **Top Interview Questions & Approaches:** 3-4 high-value targeted technical/behavioral insights with concise answers.
   - **Quick Action Plan / Roadmap:** Compact timeline or next steps.
5. **Human-like & Simple Language:** All explanations, gaps, and answers must be written in simple, clear, human-like language so it's easy to read at a glance.
`;

const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      responseSchema: resumePdfSchema,
    },
  });

  const rawText = interaction.output_text;
  
  // JSON parse karein
  const parsedData = JSON.parse(rawText);
  
  // Call Puppeteer function to convert HTML to PDF buffer
  const pdfBuffer = await generatePdfFromHtml(parsedData.html);
  
  return pdfBuffer;
}

export default {generateInterviewReport, generateResumePdf , generatePdfFromHtml}