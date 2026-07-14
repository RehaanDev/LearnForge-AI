# 🚀 LearnForge AI

<div align="center">

# LearnForge AI
### AI-Powered Personalized Career Mentor using IBM watsonx.ai

An intelligent career mentoring platform that generates personalized learning roadmaps, analyzes skill gaps, conducts AI-powered quizzes, and provides career guidance using IBM watsonx.ai Foundation Models.

Developed as part of the **IBM SkillsBuild AICTE Internship Program 2026**

</div>

---

# 📖 Overview

LearnForge AI is an AI-powered career mentoring platform designed to help students and aspiring professionals build structured learning paths toward their dream careers.

Unlike traditional roadmap websites, LearnForge AI interacts with users conversationally, understands their educational background and career aspirations, and generates personalized recommendations using IBM watsonx.ai Large Language Models.

The application follows a modern Full Stack AI architecture consisting of a responsive frontend, FastAPI backend, and IBM watsonx.ai cloud services.

---

# 🎯 Problem Statement

Many students face challenges such as:

- Not knowing where to begin learning.
- Choosing the right technologies.
- Identifying skill gaps.
- Planning a study schedule.
- Selecting suitable projects and certifications.

LearnForge AI solves these challenges by generating customized AI-powered learning roadmaps based on each learner's unique profile.

---

# ✨ Features

## 🤖 AI Career Mentor

Generate personalized learning roadmaps based on:

- Name
- Education
- Career Goal
- Existing Skills
- Programming Languages
- Experience Level
- Daily Study Hours
- Preferred Learning Style
- Target Timeline

---

## 📚 Personalized Learning Roadmap

The AI generates:

- Skill Assessment
- Personalized Learning Roadmap
- Weekly Study Plan
- Recommended Courses
- Hands-on Projects
- Certifications
- Career Tips

---

## 💬 Interactive Chat Interface

Instead of traditional forms, LearnForge AI provides an interactive AI conversation where the mentor asks questions one by one before generating recommendations.

---

## 📊 Skill Gap Analysis

The application compares the student's current skills with the target career and visually highlights areas that need improvement.

---

## 🧠 AI Quiz Generator

Students can test their knowledge through AI-generated quizzes related to their chosen career path.

---

## 🎮 Gamification

The platform includes:

- XP Points
- Daily Streak Counter
- Progress Tracking
- Interactive Learning Experience

---

## 🌗 Dark / Light Theme

Users can seamlessly switch between Dark Mode and Light Mode.

---

## 📥 Export Roadmap

Generated learning roadmaps can be exported in Markdown format for future reference.

---

## 👨‍💻 Developer Profile

The application includes an integrated developer profile card showcasing project information and contact details.

---

# 🏗 System Architecture

```
                 User

                  │

                  ▼

      HTML • CSS • JavaScript Frontend

                  │

             REST API (Fetch)

                  │

                  ▼

          FastAPI Backend (Python)

                  │

                  ▼

     IBM Cloud IAM Authentication

                  │

                  ▼

      IBM watsonx.ai Foundation Model

                  │

                  ▼

      AI Generated Learning Roadmap

                  │

                  ▼

         Interactive User Interface
```

---

# 💻 Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API
- Marked.js (Markdown Rendering)

---

## Backend

- Python
- FastAPI
- Uvicorn
- Requests
- python-dotenv

---

## Artificial Intelligence

- IBM watsonx.ai
- IBM Granite Foundation Models
- Prompt Engineering
- Large Language Models (LLMs)

---

## Cloud Platform

- IBM Cloud
- IBM IAM Authentication
- IBM Watson Machine Learning APIs

---

## Additional Libraries

The project includes several modern AI and backend libraries for future scalability, including LangChain, ChromaDB, Hugging Face, SQLAlchemy, and IBM Watsonx SDK. requirements.txt

---

# 📁 Project Structure

```
LearnForge-AI/

│

├── backend/

│   ├── main.py

│   ├── ai.py

│   ├── requirements.txt

│   └── .env

│

├── frontend/

│   ├── index.html

│   ├── style.css

│   └── script.js

│

└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/LearnForge-AI.git

cd LearnForge-AI
```

---

## Create Virtual Environment

```bash
python3 -m venv venv
```

---

## Activate Virtual Environment

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🔐 Configure Environment Variables

Create

```
backend/.env
```

Add

```env
IBM_API_KEY=YOUR_API_KEY

IBM_PROJECT_ID=YOUR_PROJECT_ID

IBM_URL=https://us-south.ml.cloud.ibm.com
```

---

# ▶️ Run Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

# 🌐 Run Frontend

Open

```
frontend/index.html
```

or use

```bash
python3 -m http.server
```

---

# 🔌 API Endpoints

## GET /

Returns backend status.

---

## POST /generate

Generates a personalized AI learning roadmap.

---

## POST /chat

Interactive AI conversation based on the generated roadmap.

---

## POST /skill-gap

Analyzes the user's skill gaps and provides recommendations.

---

## POST /quiz

Generates an AI-powered quiz based on the user's selected domain.

---

# 🧠 How It Works

1. User starts an interactive conversation.
2. LearnForge AI collects career information.
3. Frontend sends the data to the FastAPI backend.
4. Backend authenticates with IBM Cloud IAM.
5. IBM watsonx.ai processes the prompt.
6. The Foundation Model generates a personalized roadmap.
7. Results are displayed inside the interactive chat interface.
8. Users can continue chatting, analyze skill gaps, or take quizzes.

---

# 📸 Screenshots

Add screenshots here.

```
screenshots/home.png

screenshots/chat.png

screenshots/roadmap.png

screenshots/quiz.png
```

---

# 🚀 Future Enhancements

Future versions of LearnForge AI may include:

- User Authentication
- Dashboard Analytics
- Resume Analyzer
- Resume Builder
- Interview Preparation
- Coding Challenge Generator
- Internship Recommendation System
- Progress Dashboard
- PDF Export
- AI Document Analysis
- Mobile Responsive Improvements
- Multi-language Support

---

# 👨‍💻 Developer

## Muhammad Rehan Madarsaheb Jamadar

**IBM SkillsBuild AICTE Intern**

📧 Primary Email

connect.rehan@outlook.in

📧 Secondary Email

jamadarmdrehaan@gmail.com

---

## AICTE Student ID

```
STU6a094c177c7031778994199
```

---

## Internship ID

```
INTERNSHIP_177763906469f49e98e105d
```

---

# 🙏 Acknowledgements

This project was developed using:

- IBM SkillsBuild
- IBM watsonx.ai
- IBM Cloud
- AICTE
- FastAPI
- Python
- HTML5
- CSS3
- JavaScript
- Open Source Community

---

# 📜 License

This project is developed for educational, learning, and internship purposes.

© 2026 Muhammad Rehan Madarsaheb Jamadar

All Rights Reserved.