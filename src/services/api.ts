import { 
  generateStudyResponse, 
  generateCodeResponse, 
  generatePdfChatResponse, 
  generateResearchSummary 
} from './gemini';

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload-pdf', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload PDF');
  return response.json();
};

export const saveChatHistory = async (userId: number, tool: string, question: string, answer: string) => {
  const response = await fetch('/api/save-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, tool, question, answer }),
  });
  if (!response.ok) console.error('Failed to save chat history');
};

export const chatWithPdf = async (userId: number, question: string, pdfText: string) => {
  try {
    const answer = await generatePdfChatResponse(pdfText, question);
    await saveChatHistory(userId, 'chat-pdf', question, answer);
    return answer;
  } catch (error) {
    console.error('Chat PDF Error:', error);
    throw error;
  }
};

export const getStudyAssistantResponse = async (userId: number, question: string) => {
  try {
    const answer = await generateStudyResponse(question);
    await saveChatHistory(userId, 'study-assistant', question, answer);
    return answer;
  } catch (error) {
    console.error('Study Assistant Error:', error);
    throw error;
  }
};

export const getCodeHelperResponse = async (userId: number, code: string) => {
  try {
    const answer = await generateCodeResponse(code);
    await saveChatHistory(userId, 'code-helper', code, answer);
    return answer;
  } catch (error) {
    console.error('Code Helper Error:', error);
    throw error;
  }
};

export const getResearchSummary = async (userId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const extractResponse = await fetch('/api/extract-text', {
    method: 'POST',
    body: formData,
  });
  
  if (!extractResponse.ok) throw new Error('Failed to extract text from PDF');
  const { text } = await extractResponse.json();
  
  try {
    const summary = await generateResearchSummary(text);
    await saveChatHistory(userId, 'research-summary', `Summarize ${file.name}`, summary);
    return summary;
  } catch (error) {
    console.error('Research Summary Error:', error);
    throw error;
  }
};

export const getChatHistory = async (userId: number) => {
  const response = await fetch(`/api/chat-history?user_id=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch chat history');
  return response.json();
};
