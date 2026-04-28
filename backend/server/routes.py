from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import io
import pypdf
from server.db import get_db
from models.chat_history import ChatHistory, Document, User
from server.ai import (
    process_pdf_text,
    chat_with_pdf_logic,
    study_assistant_logic,
    code_helper_logic,
    research_summarizer_logic
)
from pydantic import BaseModel

router = APIRouter(prefix="/api")

class QuestionRequest(BaseModel):
    user_id: int
    question: str

class CodeRequest(BaseModel):
    user_id: int
    code: str

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        process_pdf_text(text)
        
        new_doc = Document(filename=file.filename)
        db.add(new_doc)
        db.commit()
        
        return {"message": "File uploaded and processed successfully", "filename": file.filename}
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail="Error processing PDF")

@router.post("/chat-pdf")
async def chat_pdf(request: QuestionRequest, db: Session = Depends(get_db)):
    try:
        answer = chat_with_pdf_logic(request.question)
        new_chat = ChatHistory(
            user_id=request.user_id,
            tool="chat-pdf",
            question=request.question,
            answer=answer
        )
        db.add(new_chat)
        db.commit()
        return {"answer": answer}
    except Exception as e:
        print(f"Chat PDF Error: {e}")
        raise HTTPException(status_code=500, detail="Error in chat-pdf")

@router.post("/study-assistant")
async def study_assistant(request: QuestionRequest, db: Session = Depends(get_db)):
    try:
        answer = study_assistant_logic(request.question)
        new_chat = ChatHistory(
            user_id=request.user_id,
            tool="study-assistant",
            question=request.question,
            answer=answer
        )
        db.add(new_chat)
        db.commit()
        return {"answer": answer}
    except Exception as e:
        print(f"Study Assistant Error: {e}")
        raise HTTPException(status_code=500, detail="Error in study-assistant")

@router.post("/code-helper")
async def code_helper(request: CodeRequest, db: Session = Depends(get_db)):
    try:
        answer = code_helper_logic(request.code)
        new_chat = ChatHistory(
            user_id=request.user_id,
            tool="code-helper",
            question=request.code,
            answer=answer
        )
        db.add(new_chat)
        db.commit()
        return {"answer": answer}
    except Exception as e:
        print(f"Code Helper Error: {e}")
        raise HTTPException(status_code=500, detail="Error in code-helper")

@router.post("/research-summary")
async def research_summary(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
            
        summary = research_summarizer_logic(text)
        
        new_chat = ChatHistory(
            user_id=user_id,
            tool="research-summary",
            question=f"Summarize {file.filename}",
            answer=summary
        )
        db.add(new_chat)
        db.commit()
        return {"summary": summary}
    except Exception as e:
        print(f"Research Summary Error: {e}")
        raise HTTPException(status_code=500, detail="Error in research-summary")

@router.get("/chat-history")
async def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    try:
        history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).all()
        return history
    except Exception as e:
        print(f"History Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching chat history")
