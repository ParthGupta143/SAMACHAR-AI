#Database → API → Frontend (React later)  __API LAYER__

from fastapi import FastAPI, HTTPException, Query #👉 FastAPI: Used to create APIs easily
from fastapi.middleware.cors import CORSMiddleware
from pipeline.database import SessionLocal, Article
from datetime import datetime, date
from typing import Optional

app = FastAPI(    #👉 Defines your API app..This will show auto docs at:http://localhost:8000/docs
    title="SAMACHAR.AI API",
    description="AI-powered current affairs for exam aspirants",
    version="1.0.0"
)

# This allows your React frontend to talk to this API
app.add_middleware(   #👉 Allows frontend (React) to call your API, Without this → browser blocks requests ❌
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Helper FUNCTION───────────────────────────────────────────────
def article_to_dict(a): #👉 Converts DB object → JSON response
    return {
        "id":                   a.id,
        "title":                a.title,
        "category":             a.category,
        "summary":              a.summary,
        "key_points":           a.key_points,
        "important_facts":      a.important_facts,
        "exam_relevance_score": a.exam_relevance_score,
        "verification_status":  a.verification_status,
        "source_name":          a.source_name,
        "source_url":           a.source_url,
        "published_at":         a.published_at,
        "created_at":           str(a.created_at)
    }


# ─── Routes ───────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "SAMACHAR.AI API is live 🚀"}


@app.get("/api/news/today")  #get todays news like, today`s article sorted by score
def get_today(limit: int = 50):
    """Get all of today's processed articles, highest score first."""
    session = SessionLocal()
    today = datetime.now().date()


    articles = session.query(Article)\
        .filter(Article.created_at >= today)\
        .order_by(Article.exam_relevance_score.desc())\
        .limit(limit)\
        .all()

    session.close()
    return {
        "date":    str(today),
        "count":   len(articles),
        "articles": [article_to_dict(a) for a in articles]
#FLOW: DB → filter by date → sort → return JSON
    }


@app.get("/api/news/category/{category_name}")  #category filter: eg--/api/news/category/Economy
def get_by_category(category_name: str, limit: int = 20):
    """Get articles filtered by category."""
    session = SessionLocal()

    articles = session.query(Article)\
        .filter(Article.category.ilike(f"%{category_name}%"))\
        .order_by(Article.created_at.desc())\
        .limit(limit)\
        .all()

    session.close()

    if not articles:
        raise HTTPException(   #error handling
            status_code=404,
            detail=f"No articles found for category: {category_name}"
        )

    return {
        "category": category_name,
        "count":    len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }


@app.get("/api/news/{article_id}") #single article fetch by id
def get_article(article_id: int):
    """Get a single article by ID."""
    session = SessionLocal()
    article = session.query(Article).filter(Article.id == article_id).first()
    session.close()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return article_to_dict(article)


@app.get("/api/categories")   #categories list
def get_categories():
    """Get all categories with article counts."""
    session = SessionLocal()

    from sqlalchemy import func
    results = session.query(
        Article.category,
        func.count(Article.id).label("count")  #👉 SQL aggregation (advanced usage 👏)
    ).group_by(Article.category)\
     .order_by(func.count(Article.id).desc())\
     .all()

    session.close()

    return {
        "categories": [
            {"name": r.category, "count": r.count}
            for r in results
        ]
    }

#SEARCH eg:/api/news/search/query?q=India
@app.get("/api/news/search/query")
def search(q: str = Query(..., min_length=2), limit: int = 20):
    """Search articles by keyword in title or summary."""
    session = SessionLocal()

    articles = session.query(Article).filter(
        Article.title.ilike(f"%{q}%") |
        Article.summary.ilike(f"%{q}%")  #👉 OR search (title OR summary)
    ).order_by(Article.exam_relevance_score.desc())\
     .limit(limit)\
     .all()

    session.close()

    return {
        "query":    q,
        "count":    len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }

#👉 Dashboard data: total articles, today count, top articles
@app.get("/api/stats")
def get_stats():
    """Dashboard stats — total articles, categories covered, today's count."""
    session = SessionLocal()
    today = datetime.now().date()

    total     = session.query(Article).count()
    today_count = session.query(Article)\
        .filter(Article.created_at >= today).count()
    top_score = session.query(Article)\
        .order_by(Article.exam_relevance_score.desc()).first()

    session.close()

    return {
        "total_articles":   total,
        "today_articles":   today_count,
        "top_article_today": top_score.title if top_score else None
    }

@app.get("/api/news/recent")
def get_recent(limit: int = 50):
    """Get most recent articles regardless of date."""
    session = SessionLocal()
    articles = session.query(Article)\
        .order_by(Article.created_at.desc())\
        .limit(limit)\
        .all()
    session.close()
    return {
        "count": len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }

@app.post("/api/admin/run-pipeline")
def run_pipeline_once():
    """One-time endpoint to seed the database."""
    from pipeline.fetcher import fetch_headlines, save_raw_articles
    from pipeline.processor import process_all
    from pipeline.database import save_articles

    articles = fetch_headlines()
    if not articles:
        return {"status": "error", "message": "No articles fetched"}
    
    save_raw_articles(articles)
    processed = process_all(articles)
    saved = save_articles(processed) if processed else 0
    
    return {
        "status": "success",
        "fetched": len(articles),
        "processed": len(processed),
        "saved": saved
    }
#SYSTEM FLOW: RSS → AI → DB → FastAPI → Frontend