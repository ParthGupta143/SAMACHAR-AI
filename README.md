# SAMACHAR.AI 🗞️
### AI-Powered Current Affairs Platform for Government Exam Aspirants

> Live at: [samachar-ai-beta.vercel.app](https://samachar-ai-beta.vercel.app)
Screenshot of live demo: <img width="1901" height="963" alt="image" src="https://github.com/user-attachments/assets/77d045c6-efe5-4852-b9ca-2feb0e73525d" />

---

## Problem
Government exam aspirants (UPSC, SSC, Banking) waste 2-3 hours daily 
searching for relevant current affairs across dozens of sources.

## Solution
SAMACHAR.AI automatically collects, filters, and summarizes exam-relevant 
news using AI — delivering structured current affairs in seconds.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Processing | Groq API (LLaMA 3.3 70B) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Frontend | React + TailwindCSS |
| Deployment | Vercel + Render |
| News Sources | RSS Feeds (10+ sources) |

---

## Architecture


***RSS Feeds → Python Pipeline → Groq AI → PostgreSQL → FastAPI → React***

## Features
- 🤖 AI filters exam-relevant news from 10+ sources every 6 hours
- 📂 16 exam categories (Politics, Economy, Defense, etc.)
- ✅ Verification status on every article
- ⭐ Exam relevance scoring (1-10)
- 🔍 Full-text search
- 📱 Mobile responsive

---



## API Endpoints

| Endpoint | Description |
|---|---|
| GET /api/news/recent | Latest articles |
| GET /api/news/category/{name} | Filter by category |
| GET /api/news/{id} | Single article |
| GET /api/categories | All categories with counts |
| GET /api/news/search/query?q= | Search |
| GET /api/stats | Dashboard stats |

---

## Roadmap
- [ ] Daily quiz generation from news
- [ ] User authentication + bookmarks  
- [ ] Weekly digest email
- [ ] Mobile app

---

Built by [Parth Gupta](https://github.com/ParthGupta143) | 
B.Tech AI & Data Sciences, 2026
