# 🚀 LearnForge AI

<div align="center">

<img src="https://img.shields.io/badge/IBM-watsonx.ai-blue?style=for-the-badge&logo=ibm" />
<img src="https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge&logo=python" />
<img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Deployment-Netlify-00C7B7?style=for-the-badge&logo=netlify" />
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render" />
<img src="https://img.shields.io/badge/License-Educational-red?style=for-the-badge" />

# LearnForge AI

### AI-Powered Personalized Career Mentor using IBM watsonx.ai

An intelligent AI-powered career mentoring platform that generates personalized learning roadmaps, performs skill-gap analysis, conducts AI-powered quizzes, and provides adaptive career guidance using **IBM watsonx.ai Foundation Models (IBM Granite)**.

Developed as part of the **IBM SkillsBuild AICTE Internship 2026**

</div>

---

# 🌐 Live Demo

### 🚀 Frontend

https://learnforgeai.netlify.app/

### ⚡ Backend API

https://learnforge-ai-hy8b.onrender.com/

### API Base URL

https://learnforge-ai-hy8b.onrender.com

---

# 📖 Overview

LearnForge AI is an AI-powered career mentoring platform built to help students and aspiring professionals learn efficiently through personalized AI-generated learning pathways.

Instead of showing generic roadmaps, LearnForge AI first understands the learner through an interactive conversation and then generates a customized roadmap based on:

- Educational Background
- Current Skills
- Programming Languages
- Career Goal
- Experience Level
- Learning Style
- Daily Study Hours
- Target Timeline

The roadmap is generated using **IBM watsonx.ai Foundation Models**, enabling dynamic recommendations instead of static predefined content.

The project follows a modern Full Stack AI architecture consisting of a responsive frontend, FastAPI backend, and IBM watsonx.ai cloud services.

---

# 🎯 Problem Statement

Students often struggle with questions like:

- Where should I start?
- Which technologies should I learn first?
- Which projects should I build?
- Which certifications are worth doing?
- How can I prepare for interviews?
- Which skills am I missing?
- How should I plan my daily learning?

Most online roadmap websites provide the same roadmap to everyone.

LearnForge AI solves this problem by generating a personalized roadmap for every learner using AI.

---

# ✨ Features

## 🤖 AI Career Mentor

Interactive AI mentor that collects learner information through a conversational interface instead of lengthy forms.

It gathers:

- Name
- Education
- Career Goal
- Current Skills
- Programming Languages
- Experience Level
- Daily Study Hours
- Preferred Learning Style
- Learning Timeline

---

## 🛣 Personalized AI Learning Roadmap

Generate AI-powered learning roadmaps including:

- Skill Assessment
- Complete Learning Roadmap
- Weekly Study Plan
- Recommended Courses
- Hands-on Projects
- Certifications
- Career Tips
- Learning Resources

---

## 💬 AI Chat Mentor

Continue chatting with the AI mentor even after roadmap generation.

Ask questions such as:

- Explain a concept
- Suggest resources
- Recommend projects
- Clarify roadmap steps
- Career guidance

---

## 📊 Skill Gap Analysis

Analyze existing skills against the selected career path.

Provides:

- Current Skill Percentage
- Target Skill Percentage
- Missing Skills
- AI Recommendations

---

## 🧠 AI Quiz Generator

Generate AI-powered quizzes based on:

- Selected Career
- Skills
- Experience Level

Features:

- Multiple Choice Questions
- Instant Evaluation
- Explanations
- Score Tracking

---

## 🎮 Gamification

Learning becomes more engaging with:

- XP Points
- Daily Streak Counter
- Progress Tracking
- Achievement Feel
- Interactive Learning Experience

---

## 📈 Progress Tracking

Users can mark roadmap sections as completed.

Features:

- Completion Percentage
- Visual Progress Bar
- Continue Learning Button
- Persistent Progress Storage

---

## 🔄 Continue Learning

Adaptive AI roadmap updates based on completed topics.

The AI suggests:

- Next Topics
- Revision Areas
- Advanced Concepts
- Additional Projects

---

## 💾 Resume Previous Session

Users can continue exactly where they left off.

Session stores:

- User Profile
- Generated Roadmap
- Completed Topics
- Chat History

---

## 🌙 Dark / Light Theme

Switch seamlessly between:

- Dark Theme
- Light Theme

Theme preference is stored locally.

---

## 📥 Export Roadmap

Export generated roadmap as:

- Markdown (.md)

For future reference or documentation.

---

## 👨‍💻 Developer Profile

Built-in developer card displaying:

- Developer Information
- LinkedIn
- Email
- Project Credits

---

# 🏗 System Architecture

```text
                    User

                      │

                      ▼

      HTML • CSS • JavaScript Frontend

          (Hosted on Netlify)

                      │

                 REST API

                      ▼

          FastAPI Backend (Python)

            (Hosted on Render)

                      │

       IBM Cloud IAM Authentication

                      │

                      ▼

     IBM watsonx.ai Foundation Models

          (IBM Granite LLM)

                      │

                      ▼

      Personalized Career Guidance

       • Learning Roadmap
       • Skill Gap Analysis
       • AI Mentor
       • Adaptive Learning
       • AI Quiz Generator
```

---

# 💻 Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API
- Marked.js
- Local Storage

---

## Backend

- Python
- FastAPI
- Uvicorn
- Requests
- Pydantic
- python-dotenv

---

## Artificial Intelligence

- IBM watsonx.ai
- IBM Granite Foundation Models
- Prompt Engineering
- Large Language Models (LLMs)

---

## Cloud Services

- IBM Cloud
- IBM IAM Authentication
- IBM Watson Machine Learning API

---

## Deployment

### Frontend

- Netlify

### Backend

- Render

---

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- IBM Cloud

# 📁 Project Structure

```text
LearnForge-AI/
│
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── ai.py                   # IBM watsonx.ai integration
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html              # Main User Interface
│   ├── style.css               # Styling
│   ├── script.js               # Frontend Logic
│   └── assets/
│       └── img/
│           └── dev.jpg
│
├── screenshots/
│   ├── home.png
│   ├── roadmap.png
│   ├── skill-gap.png
│   └── quiz.png
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

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🔐 Environment Variables

Create a file inside

```
backend/.env
```

Add the following credentials:

```env
IBM_API_KEY=YOUR_API_KEY

IBM_PROJECT_ID=YOUR_PROJECT_ID

IBM_URL=https://us-south.ml.cloud.ibm.com
```

---

# ▶️ Run Backend

Navigate to backend

```bash
cd backend
```

Run FastAPI

```bash
uvicorn main:app --reload
```

Backend starts at

```
http://127.0.0.1:8000
```

---

# 🌐 Run Frontend

Simply open

```
frontend/index.html
```

or start a local server

```bash
python -m http.server
```

---

# 🚀 Deployment

## Frontend Deployment

Platform

```
Netlify
```

Live URL

```
https://learnforgeai.netlify.app/
```

---

## Backend Deployment

Platform

```
Render
```

Live API

```
https://learnforge-ai-hy8b.onrender.com/
```

---

# 🔌 API Documentation

## GET /

Checks backend status.

Example

```http
GET /
```

---

## POST /generate

Generate AI-powered personalized learning roadmap.

Example Request

```json
{
    "name":"John",
    "goal":"Frontend Developer"
}
```

---

## POST /chat

Continue chatting with the AI mentor.

Example

```json
{
    "message":"Explain React Hooks"
}
```

---

## POST /skill-gap

Analyze current skills against target career.

Returns

- Current Skill Level
- Target Skill Level
- Missing Skills
- AI Recommendations

---

## POST /quiz

Generate AI-powered quiz.

Returns

- Questions
- Options
- Correct Answers
- Explanations

---

## POST /adapt-roadmap

Generate adaptive roadmap based on completed learning progress.

Returns

- Updated Roadmap
- Next Learning Topics
- Recommended Projects
- Revision Suggestions

---

# 🔄 Application Workflow

```text
User Starts Session
          │
          ▼
Interactive AI Conversation
          │
          ▼
Collect User Information
          │
          ▼
FastAPI Backend
          │
          ▼
IBM Cloud Authentication
          │
          ▼
IBM watsonx.ai (Granite)
          │
          ▼
Generate Learning Roadmap
          │
          ▼
Display Interactive Roadmap
          │
          ▼
Continue Learning
          │
          ├────────► AI Chat
          │
          ├────────► Skill Gap Analysis
          │
          ├────────► AI Quiz
          │
          └────────► Adaptive Roadmap
```

---

# 🧠 How LearnForge AI Works

1. User starts an AI conversation.

2. AI collects learner information.

3. Frontend sends data to FastAPI.

4. Backend authenticates with IBM Cloud.

5. IBM watsonx.ai processes prompts.

6. IBM Granite generates a personalized roadmap.

7. Roadmap is displayed interactively.

8. Users continue chatting with AI.

9. Users analyze skill gaps.

10. Users attempt AI-generated quizzes.

11. Progress is stored locally.

12. AI updates learning recommendations as progress increases.

---

# 📸 Screenshots

Add screenshots inside

```
screenshots/
```

Example

```
screenshots/

home.png

chat.png

roadmap.png

skill-gap.png

quiz.png
```

Example Markdown

```md
## Home

![Home](screenshots/home.png)

## AI Chat

![Chat](screenshots/chat.png)

## Roadmap

![Roadmap](screenshots/roadmap.png)

## Skill Gap

![Skill Gap](screenshots/skill-gap.png)

## Quiz

![Quiz](screenshots/quiz.png)
```

---

# 🚀 Future Enhancements

Planned improvements include:

- User Authentication
- Cloud Database
- Dashboard Analytics
- Resume Analyzer
- Resume Builder
- AI Interview Preparation
- Coding Challenge Generator
- Internship Recommendation Engine
- Certificate Tracker
- Learning Dashboard
- PDF Export
- AI Voice Mentor
- Multi-language Support
- Mobile Responsive Improvements
- Mobile Application
- Learning Notifications
- Team Collaboration
- AI Learning Analytics

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository.

2. Create a new branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push your branch.

```bash
git push origin feature-name
```

5. Create a Pull Request.

---

# 👨‍💻 Developer

## Muhammad Rehan Madarsaheb Jamadar

**B.Tech Computer Science & Engineering Student**

**IBM SkillsBuild AICTE Internship 2026**

Developer of **LearnForge AI**

### Contact

📧 Primary

```
connect.rehan@outlook.in
```

📧 Secondary

```
jamadarmdrehaan@gmail.com
```

### LinkedIn

```
https://www.linkedin.com/in/mdrehan08
```

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

This project was developed using

- IBM SkillsBuild
- IBM watsonx.ai
- IBM Granite Foundation Models
- IBM Cloud
- AICTE
- FastAPI
- Python
- HTML5
- CSS3
- JavaScript
- Open Source Community

Special thanks to IBM SkillsBuild and AICTE for providing the opportunity to build real-world AI applications during the internship.

---

# 📜 License

This project was developed as part of the **IBM SkillsBuild AICTE Internship 2026**.

Copyright © 2026

**Muhammad Rehan Madarsaheb Jamadar**

This project is intended for educational, research, and demonstration purposes.

---

<div align="center">

### ⭐ If you found this project helpful, don't forget to Star this repository!

Made with ❤️ using **IBM watsonx.ai**, **FastAPI**, and **JavaScript**

</div>