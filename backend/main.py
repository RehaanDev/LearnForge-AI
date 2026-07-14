from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ai import (
    generate_learning_path,
    chat_with_mentor,
    analyze_skill_gap,
    generate_quiz,
    adapt_roadmap,
)

app = FastAPI(title="LearnMate AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CareerRequest(BaseModel):
    name: str
    education: str
    goal: str
    skills: str
    languages: str
    experience: str
    study_hours: str
    learning_style: str
    timeline: str


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    roadmap_context: str
    history: List[ChatMessage] = []
    message: str


class SkillGapRequest(BaseModel):
    goal: str
    skills: str
    languages: str


class QuizRequest(BaseModel):
    topic: str
    goal: str
    difficulty: str = "Beginner"


class AdaptRequest(BaseModel):
    goal: str
    roadmap_context: str
    completed_items: List[str] = []
    progress_percent: int = 0
    note: str = ""


@app.get("/")
def home():
    return {"message": "LearnMate AI Backend Running 🚀"}


@app.post("/generate")
def generate(request: CareerRequest):
    return generate_learning_path(request)


@app.post("/chat")
def chat(request: ChatRequest):
    return chat_with_mentor(request)


@app.post("/skill-gap")
def skill_gap(request: SkillGapRequest):
    return analyze_skill_gap(request)


@app.post("/quiz")
def quiz(request: QuizRequest):
    return generate_quiz(request)


@app.post("/adapt-roadmap")
def adapt_roadmap_endpoint(request: AdaptRequest):
    return adapt_roadmap(request)