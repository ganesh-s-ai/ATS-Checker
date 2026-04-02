import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Overall ATS score out of 100" },
    keywordsMatch: { type: Type.INTEGER, description: "Score for keywords match out of 100" },
    formatting: { type: Type.INTEGER, description: "Score for formatting out of 100" },
    readability: { type: Type.INTEGER, description: "Score for readability out of 100" },
    skillsRelevance: { type: Type.INTEGER, description: "Score for skills relevance out of 100" },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of missing keywords based on general industry standards or provided job description"
    },
    matchedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of matched keywords found in the resume"
    },
    weakSections: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of weak sections in the resume (e.g., 'Experience', 'Education')"
    },
    formattingIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of formatting issues found"
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "Original text from resume" },
          improved: { type: Type.STRING, description: "Improved version using strong action verbs and quantifiable results" },
          reason: { type: Type.STRING, description: "Reason for the suggestion" }
        }
      },
      description: "Specific improvement suggestions for bullet points"
    }
  },
  required: ["score", "keywordsMatch", "formatting", "readability", "skillsRelevance", "missingKeywords", "matchedKeywords", "weakSections", "formattingIssues", "improvementSuggestions"]
};

export async function analyzeResume(resumeText: string, jobDescription?: string): Promise<any> {
  const prompt = `
    Analyze the following resume text and evaluate its ATS compatibility.
    ${jobDescription ? `Compare it against this job description: ${jobDescription}` : 'Evaluate it based on general industry best practices for ATS systems.'}
    
    Resume Text:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert ATS (Applicant Tracking System) analyzer and career coach. Your goal is to help users improve their resumes to pass ATS filters and impress recruiters. Be objective, constructive, and highly specific in your recommendations.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}
