import os
import re
import json
import requests
from dotenv import load_dotenv

load_dotenv()

IBM_API_KEY = os.getenv("IBM_API_KEY")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")
IBM_URL = os.getenv("IBM_URL")

# IBM Granite foundation model — required by the problem statement.
# Verify this exact ID against your watsonx.ai project's available
# foundation models (Prompt Lab > Foundation Models), it varies by
# IBM Cloud Lite region/plan.
MODEL_ID = "ibm/granite-3-8b-instruct"


def get_access_token():
    """Get IBM Cloud IAM Access Token"""
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": IBM_API_KEY
    }
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


def _call_watsonx(prompt, max_new_tokens=900, min_new_tokens=50):
    """Shared helper for calling the watsonx.ai text generation endpoint (IBM Granite)."""
    token = get_access_token()
    endpoint = f"{IBM_URL}/ml/v1/text/generation?version=2023-05-29"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "model_id": MODEL_ID,
        "input": prompt,
        "project_id": IBM_PROJECT_ID,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": max_new_tokens,
            "min_new_tokens": min_new_tokens
        }
    }

    response = requests.post(endpoint, headers=headers, json=payload)

    if response.status_code != 200:
        return {
            "success": False,
            "status_code": response.status_code,
            "error": response.text
        }

    output = response.json()
    return {
        "success": True,
        "response": output["results"][0]["generated_text"]
    }


def _extract_json(text):
    """
    Pull the first valid JSON value out of a model response, ignoring
    any trailing text the model adds after the JSON.
    """
    text = text.strip()
    start = None
    for i, ch in enumerate(text):
        if ch in "{[":
            start = i
            break
    if start is None:
        raise ValueError("No JSON found in model output")
    decoder = json.JSONDecoder()
    obj, _ = decoder.raw_decode(text[start:])
    return obj


def generate_learning_path(data):
    """Generate the initial AI Learning Roadmap"""
    prompt = f"""
You are LearnMate AI, an expert Agentic AI Career Coach speaking directly to a student in a friendly, encouraging tone.

Student Details
Name: {data.name}
Education: {data.education}
Career Goal: {data.goal}
Current Skills: {data.skills}
Programming Languages: {data.languages}
Experience Level: {data.experience}
Daily Study Hours: {data.study_hours}
Preferred Learning Style: {data.learning_style}
Target Timeline: {data.timeline}

Generate a detailed report using Markdown with these exact numbered section headings (use "## " before each):

## 1. Skill Assessment
## 2. Personalized Learning Roadmap
## 3. Weekly Study Plan
## 4. Recommended Courses
## 5. Hands-on Projects
## 6. Certifications
## 7. Career Tips

Keep it specific to the student's profile, actionable, and encouraging.
"""
    return _call_watsonx(prompt, max_new_tokens=900, min_new_tokens=100)


def chat_with_mentor(data):
    """Follow-up conversation, aware of the roadmap already generated."""
    history_text = ""
    for turn in data.history[-8:]:
        role = "Student" if turn.role == "user" else "Forge"
        history_text += f"{role}: {turn.content}\n"

    prompt = f"""
You are Forge, an upbeat and knowledgeable AI career coach chatting inside the LearnMate app.

Here is the learning roadmap you already gave this student:
{data.roadmap_context[:2500]}

Conversation so far:
{history_text}
Student: {data.message}

Reply as Forge in 2-5 short, friendly, conversational sentences. Be specific and helpful, referencing the roadmap where useful. Do not repeat the whole roadmap back.
"""
    return _call_watsonx(prompt, max_new_tokens=350, min_new_tokens=20)


def analyze_skill_gap(data):
    """Compare current skills against the target goal."""
    prompt = f"""
You are a career-skills analyst. A student wants to become a "{data.goal}".
Their current skills are: {data.skills}
Their current languages are: {data.languages}

Identify the 6 most important skills required for this goal. For each, estimate the student's current proficiency (0-100) based on what they listed, and the target proficiency needed (usually 80-100).

Respond with ONLY valid JSON, no prose, no markdown fences, in this exact shape:
[
  {{"skill": "string", "current": 0, "target": 0, "tip": "one short actionable tip"}}
]
"""
    result = _call_watsonx(prompt, max_new_tokens=600, min_new_tokens=50)
    if not result.get("success"):
        return result
    try:
        gaps = _extract_json(result["response"])
        return {"success": True, "gaps": gaps}
    except Exception as e:
        return {"success": False, "error": f"Could not parse AI response: {e}"}


def generate_quiz(data):
    """Generate a short multiple-choice quiz on a topic."""
    prompt = f"""
Create a {data.difficulty} level, 5 question multiple choice quiz to test knowledge relevant to "{data.topic}" for a student aiming to become a {data.goal}.

Respond with ONLY valid JSON, no prose, no markdown fences, in this exact shape:
[
  {{
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correct_index": 0,
    "explanation": "one short sentence"
  }}
]
"""
    result = _call_watsonx(prompt, max_new_tokens=800, min_new_tokens=50)
    if not result.get("success"):
        return result
    try:
        questions = _extract_json(result["response"])
        return {"success": True, "questions": questions}
    except Exception as e:
        return {"success": False, "error": f"Could not parse AI response: {e}"}


def adapt_roadmap(data):
    """
    Agentic re-planning step. Given the original roadmap and what the
    student has actually completed so far, Granite re-assesses progress
    and returns a focused next action plus any adjustment to the remaining
    path. This is what makes LearnMate agentic rather than a one-shot
    generator: it revisits and adapts the plan as the student progresses.
    """
    completed_text = "\n".join(f"- {item}" for item in data.completed_items) or "Nothing marked complete yet."

    prompt = f"""
You are Forge, an agentic AI career coach revisiting a student's learning roadmap after some time has passed.

Student goal: {data.goal}

Original roadmap:
{data.roadmap_context[:2500]}

Completed so far ({data.progress_percent}% of the roadmap):
{completed_text}

Student note: {data.note or "No additional note."}

Respond in Markdown with exactly these three headings:

## Progress Check
Briefly acknowledge what they've completed and how it's going, in 1-2 sentences.

## Continue Here
Give the single most important next action to take right now, in concrete, specific detail.

## Adjusted Focus
If their progress or note suggests the remaining plan should shift (more/less time on something, a skipped step, a new interest), say so briefly. Otherwise confirm the existing plan is still on track.

Keep the whole reply short, specific, and motivating.
"""
    return _call_watsonx(prompt, max_new_tokens=500, min_new_tokens=40)