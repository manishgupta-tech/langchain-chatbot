import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const generateStudyResponse = async (question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a helpful study assistant. Answer the following educational question: ${question}`,
  });
  return response.text;
};

export const generateCodeResponse = async (codeQuery: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert programmer. Explain or debug the following code: ${codeQuery}`,
  });
  return response.text;
};

export const generatePdfChatResponse = async (pdfText: string, question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a helpful assistant. Use the following PDF content to answer the question.
    
    PDF Content:
    ${pdfText.substring(0, 30000)}
    
    Question: ${question}`,
  });
  return response.text;
};

export const generateResearchSummary = async (pdfText: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this research paper content and provide a summary, key points, and a detailed explanation.
    
    Content:
    ${pdfText.substring(0, 30000)}`,
  });
  return response.text;
};
