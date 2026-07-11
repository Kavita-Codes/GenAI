import { GoogleGenAI } from "@google/genai";
import {z} from "zod"
import {zodToJsonSchema} from "zod-to-json-schema"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function gemini() {
 try {
     const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: "what is apple",
  });
  console.log(interaction.output_text);
 } catch (error) {
    console.log(error.message)
 }
}

export default gemini;


