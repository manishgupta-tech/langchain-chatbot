import express from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import db from './db.js';
import { processPdf, chatWithPdf, studyAssistant, codeHelper, researchSummarizer } from './ai.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-pdf', upload.single('file'), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  try {
    const data = await pdf(req.file.buffer);
    
    const stmt = db.prepare('INSERT INTO documents (filename) VALUES (?)');
    stmt.run(req.file.originalname);
    
    res.json({ 
      message: 'File uploaded and processed successfully', 
      filename: req.file.originalname,
      text: data.text 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing PDF' });
  }
});

router.post('/save-chat', async (req, res) => {
  const { user_id, tool, question, answer } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO chat_history (user_id, tool, question, answer) VALUES (?, ?, ?, ?)');
    stmt.run(user_id, tool, question, answer);
    res.json({ success: true });
  } catch (error) {
    console.error('Save Chat Error:', error);
    res.status(500).json({ error: 'Error saving chat history' });
  }
});

router.post('/extract-text', upload.single('file'), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  try {
    const data = await pdf(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error('Extract Text Error:', error);
    res.status(500).json({ error: 'Error extracting text' });
  }
});

router.get('/chat-history', (req, res) => {
  const { user_id } = req.query;
  try {
    const stmt = db.prepare('SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC');
    const history = stmt.all(user_id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat history' });
  }
});

export default router;
