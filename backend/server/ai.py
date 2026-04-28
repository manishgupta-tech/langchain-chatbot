import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    google_api_key=api_key
)

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=api_key
)

# In-memory vector store for this example
vector_store = None

def process_pdf_text(text: str):
    global vector_store
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    docs = text_splitter.create_documents([text])
    vector_store = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        collection_name="pdf_chat"
    )
    return "PDF processed and stored in Chroma"

def chat_with_pdf_logic(question: str):
    global vector_store
    if not vector_store:
        return "Please upload a PDF first."
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever()
    )
    response = qa_chain.invoke(question)
    return response["result"]

def study_assistant_logic(question: str):
    template = "You are a helpful study assistant. Answer the following educational question: {question}"
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    response = chain.invoke({"question": question})
    return response.content

def code_helper_logic(code_query: str):
    template = "You are an expert programmer. Explain or debug the following code: {code_query}"
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    response = chain.invoke({"code_query": code_query})
    return response.content

def research_summarizer_logic(text: str):
    template = "Analyze this research paper content and provide a summary, key points, and a detailed explanation.\n\nContent: {content}"
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    # Limit text to avoid token limits
    response = chain.invoke({"content": text[:10000]})
    return response.content
