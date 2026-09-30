# StackFix ⚡

StackFix is a full-stack AI-powered error intelligence and automated code patch generator. It takes messy stack traces or error logs, analyzes the root cause, provides a corrected code patch, and gives prevention tips.

---

## Features
- **Multi-language Support:** Diagnose errors for Python, JavaScript/TypeScript, Java, and C++.
- **AI Diagnostic Reports:** Delivers clear root causes, corrected code snippets, and prevention tips.
- **Offline Simulation Fallback:** Works seamlessly even without active OpenAI API credits.
- **Copy-to-Clipboard:** Instantly copy generated patches with a single click.
- **Markdown Report Export:** Download detailed diagnostic reports as `.md` files.
- **Session History:** Track and switch between recent error fixes instantly.

---

## Tech Stack
- **Backend:** FastAPI, Uvicorn, Python, OpenAI API
- **Frontend:** React, Vite, Tailwind CSS v4

---

## Project Structure
```text
stackfix-backend/
├── stackfix-frontend/   # React + Vite frontend app
├── main.py              # FastAPI backend server
├── requirements.txt     # Python dependencies
├── run.py               # Unified script to run both servers
└── .env                 # Environment variables (OpenAI API key)