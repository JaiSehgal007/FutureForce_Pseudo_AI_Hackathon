from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential
from typing import List, Dict
import logging
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Course and FAQ API")

# Pydantic models for request/response
class CourseRequest(BaseModel):
    interestedAreas: List[str]

class CourseResponse(BaseModel):
    area: str
    courses: List[Dict]

class FAQRequest(BaseModel):
    question: str

class FAQResponse(BaseModel):
    question: str
    answers: List[Dict]

class QueryRequest(BaseModel):
    query: str

# Initialize Pinecone clients with API keys from .env
course_api_key = os.getenv("COURSE_API_KEY")
faq_api_key = os.getenv("FAQ_API_KEY")
azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
azure_api_key = os.getenv("AZURE_OPENAI_KEY")

if not course_api_key or not faq_api_key:
    raise ValueError("COURSE_API_KEY or FAQ_API_KEY not found in .env file")
if not azure_endpoint or not azure_api_key:
    raise ValueError("AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_KEY not found in .env file")

course_pc = Pinecone(api_key=course_api_key)
faq_pc = Pinecone(api_key=faq_api_key)

# Initialize Azure OpenAI Client
azure_client = ChatCompletionsClient(
    endpoint=azure_endpoint,
    credential=AzureKeyCredential(azure_api_key)
)

# Connect to indexes
course_index_name = "learning-buddy"
faq_index_name = "learning-buddy-faq"
course_index = course_pc.Index(course_index_name)
faq_index = faq_pc.Index(faq_index_name)

# Load embedding model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Course recommendation endpoint
@app.post("/recommend-courses", response_model=List[CourseResponse])
async def recommend_courses(request: CourseRequest):
    try:
        results = []
        for area in request.interestedAreas:
            # Generate embedding for the interest area
            embedding = model.encode(area).tolist()
            
            # Query course index
            query_results = course_index.query(
                vector=embedding,
                top_k=2,
                include_metadata=True
            )
            
            # Filter results with score > 0.7
            courses = [
                {
                    "id": match["id"],
                    "score": match["score"],
                    "course_name": match["metadata"].get("course_name", "Unknown"),
                    "category": match["metadata"].get("category", "Unknown"),
                    "text": match["metadata"].get("text", "No description")
                }
                for match in query_results["matches"]
            ]
            
            results.append({"area": area, "courses": courses})
        
        return results
    except Exception as e:
        logger.error(f"Error in recommend-courses: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# FAQ endpoint
@app.post("/faq", response_model=FAQResponse)
async def get_faq_answer(request: FAQRequest):
    try:
        # Generate embedding for the question
        embedding = model.encode(request.question).tolist()
        
        # Query FAQ index
        query_results = faq_index.query(
            vector=embedding,
            top_k=2,
            include_metadata=True
        )
        
        # Format results
        answers = [
            {
                "id": match["id"],
                "score": match["score"],
                "question": match["metadata"].get("question", "Unknown"),
                "answer": match["metadata"].get("answer", "No answer")
            }
            for match in query_results["matches"]
        ]
        
        return {"question": request.question, "answers": answers}
    except Exception as e:
        logger.error(f"Error in faq: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# FAQ RAG with Azure OpenAI endpoint
@app.post("/retrieve-faq-and-respond")
async def retrieve_faq_and_respond(request: QueryRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        # Generate embedding for the query
        query_embedding = model.encode(query).tolist()

        # Query FAQ index
        query_results = faq_index.query(
            vector=query_embedding,
            top_k=3,
            include_metadata=True
        )

        # Extract FAQs with score > 0.7
        faqs = [
            {
                "question": match.metadata.get("question", "Unknown"),
                "answer": match.metadata.get("answer", "No answer"),
                "score": match.score
            }
            for match in query_results.matches
            if match.score > 0.7
        ]

        # Construct prompt for Azure OpenAI
        faq_context = "\n".join([f"Q: {faq['question']}\nA: {faq['answer']}" for faq in faqs])
        prompt = f"""
        You are a helpful assistant. Use the following FAQ context to answer the user's query. 
        If the context doesn't fully address the query in that case check if the query is relevant to an educational website
           CASE 1: if query is relevant then answer only with respect to our Learning Buddy website
           CASE 2: if query is irrelevant then humble refuse to answer
        
        NOTE: REFRAIN FROM USING NAME OF ANY OTHER EDUCATIONAL PLATFORM

        FAQ Context:
        {faq_context}

        User Query: {query}

        Response:
        """

        # Call Azure OpenAI
        response = azure_client.complete({
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.9,
            "max_tokens": 100,
            "top_p": 1,
            "presence_penalty": 1.5,
            "frequency_penalty": 1.5
        })

        response_text = response.choices[0].message.content.strip()

        return {
            "response": response_text,
            "faqs": faqs
        }

    except Exception as e:
        logger.error(f"Error in retrieve-faq-and-respond: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}