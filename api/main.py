

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import func
from pipeline.database import SessionLocal, UserQuizAttempt, UserStats
from pipeline.database import (
    SessionLocal, Article, Quiz,
    UserQuizAttempt, init_db
)

# ─────────────────────────────────────────────
# 🚀 APP INIT
# ─────────────────────────────────────────────
app = FastAPI(
    title="SAMACHAR.AI API",
    description="AI-powered current affairs for exam aspirants",
    version="1.0.0"
)

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# 🔧 HELPER
# ─────────────────────────────────────────────
def article_to_dict(a):
    return {
        "id": a.id,
        "title": a.title,
        "category": a.category,
        "summary": a.summary,
        "key_points": a.key_points,
        "important_facts": a.important_facts,
        "exam_relevance_score": a.exam_relevance_score,
        "verification_status": a.verification_status,
        "source_name": a.source_name,
        "source_url": a.source_url,
        "published_at": a.published_at,
        "created_at": str(a.created_at),
        # "title_hi": a.title_hi,
        # "summary_hi": a.summary_hi,
        # "key_points_hi": a.key_points_hi,
        # "important_facts_hi": a.important_facts_hi
    }

# ─────────────────────────────────────────────
# 🏠 ROOT (HEAD + GET)
# ─────────────────────────────────────────────
@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "SAMACHAR.AI API is live 🚀"}

# ─────────────────────────────────────────────
# 📰 NEWS APIs
# ─────────────────────────────────────────────
# @app.get("/api/news/today")
# def get_today(limit: int = 50):
#     session = SessionLocal()

#     from datetime import datetime, timedelta

#     # IST time
#     now = datetime.utcnow() + timedelta(hours=5, minutes=30)

#     # today start
#     start = now.replace(hour=0, minute=0, second=0, microsecond=0)

#     # tomorrow start
#     end = start + timedelta(days=1)

#     articles = session.query(Article)
#     last_24h = datetime.utcnow() - timedelta(hours=24)
#     filter(Article.created_at >= last_24h)\
#         .order_by(Article.exam_relevance_score.desc())\
#         .limit(limit)\
#         .all()

#     session.close()

#     return {
#         "date": str(now.date()),
#         "count": len(articles),
#         "articles": [article_to_dict(a) for a in articles]
#     }
from datetime import datetime, timedelta

@app.get("/api/news/today")
def get_today(limit: int = 50):
    session = SessionLocal()

    cutoff = datetime.utcnow() - timedelta(days=2)   # 🔥 FIX (2 days)

    articles = session.query(Article)\
        .filter(Article.created_at >= cutoff)\
        .order_by(Article.exam_relevance_score.desc())\
        .limit(limit)\
        .all()

    session.close()

    return {
        "date": str(datetime.utcnow().date()),
        "count": len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }

@app.get("/api/news/recent")
def get_recent(limit: int = 50):
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


@app.get("/api/news/{article_id}")
def get_article(article_id: int):
    session = SessionLocal()
    article = session.query(Article).filter(Article.id == article_id).first()
    session.close()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return article_to_dict(article)

# @app.get("/api/news/{article_id}/hindi")
# def get_article_hindi(article_id: int):
#     """Get article in Hindi — translates on demand if not cached."""
#     from pipeline.translator import translate_article_to_hindi

#     article = translate_article_to_hindi(article_id)

#     if not article:
#         raise HTTPException(status_code=404, detail="Article not found")

#     return {
#         "id":                   article.id,
#         "title":                article.title_hi or article.title,
#         "category":             article.category,
#         "summary":              article.summary_hi or article.summary,
#         "key_points":           article.key_points_hi or article.key_points,
#         "important_facts":      article.important_facts_hi or article.important_facts,
#         "exam_relevance_score": article.exam_relevance_score,
#         "verification_status":  article.verification_status,
#         "source_name":          article.source_name,
#         "source_url":           article.source_url,
#     }
@app.get("/api/news/search/query")
def search(q: str = Query(..., min_length=2), limit: int = 20):
    session = SessionLocal()

    articles = session.query(Article).filter(
        Article.title.ilike(f"%{q}%") |
        Article.summary.ilike(f"%{q}%")
    ).order_by(Article.exam_relevance_score.desc())\
     .limit(limit)\
     .all()

    session.close()

    return {
        "query": q,
        "count": len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }
@app.get("/api/categories")
def get_categories():
    session = SessionLocal()

    from sqlalchemy import func

    results = session.query(
        Article.category,
        func.count(Article.id).label("count")
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
# ─────────────────────────────────────────────
# 📊 STATS
# ─────────────────────────────────────────────
@app.get("/api/stats")
def get_stats():
    session = SessionLocal()
    start = datetime.utcnow() - timedelta(days=1)

    total = session.query(Article).count()
    today_count = session.query(Article)\
        .filter(Article.created_at >= start).count()

    top = session.query(Article)\
        .order_by(Article.exam_relevance_score.desc()).first()

    session.close()

    return {
        "total_articles": total,
        "today_articles": today_count,
        "top_article_today": top.title if top else None
    }

# ─────────────────────────────────────────────
# 🧠 PIPELINE LOGIC (BACKGROUND)
# ─────────────────────────────────────────────
def actually_run_pipeline():
    # from datetime import datetime, timedelta
    # from pipeline.database import SessionLocal, Article

    # 🧹 DELETE OLD ARTICLES (older than 2 days)
    session = SessionLocal()
    cutoff = datetime.utcnow() - timedelta(days=2)

    session.query(Article).filter(
        Article.created_at < cutoff
    ).delete()

    session.commit()
    session.close()

    # 🔽 existing code (same rakho)
    from pipeline.fetcher import fetch_headlines, save_raw_articles
    from pipeline.processor import process_all
    from pipeline.database import save_articles

    articles = fetch_headlines()
    if not articles:
        return

    save_raw_articles(articles)
    processed = process_all(articles)

    if processed:
        save_articles(processed)

def actually_run_quiz():
    from pipeline.quiz_generator import generate_daily_quiz
    generate_daily_quiz()

# ─────────────────────────────────────────────
# ⚡ TRIGGER ENDPOINTS (IMPORTANT FIX)
# ─────────────────────────────────────────────
# @app.get("/trigger-pipeline")
# def trigger_pipeline(background_tasks: BackgroundTasks):
#     background_tasks.add_task(actually_run_pipeline)
#     return {"status": "pipeline started"}
@app.api_route("/trigger-pipeline", methods=["GET", "HEAD"])
def trigger_pipeline(background_tasks: BackgroundTasks):
    background_tasks.add_task(actually_run_pipeline)
    return {"status": "pipeline started"}

@app.get("/trigger-quiz")
def trigger_quiz(background_tasks: BackgroundTasks):
    background_tasks.add_task(actually_run_quiz)
    return {"status": "quiz started"}

# ─────────────────────────────────────────────
# 🧪 QUIZ APIs
# ─────────────────────────────────────────────
@app.get("/api/quiz/today")
def get_today_quiz():
    session = SessionLocal()
    quizzes = session.query(Quiz).all()
    session.close()

    return {
        "count": len(quizzes),
        "questions": [
            {
                "id": q.id,
                "question": q.question,
                "options": {
                    "A": q.option_a,
                    "B": q.option_b,
                    "C": q.option_c,
                    "D": q.option_d
                },
                "correct": q.correct,
                "explanation": q.explanation,
                "category": q.category
            } for q in quizzes
        ]
    }

# ─────────────────────────────────────────────
# 👤 USER QUIZ
# ─────────────────────────────────────────────

class QuizSubmit(BaseModel):
    clerk_user_id: str
    # user_name: str   # ✅ ADD
    score: int
    total: int
@app.post("/api/quiz/submit")
def submit_quiz(data: QuizSubmit):
    session = SessionLocal()

    try:
        # 🔢 percentage calculate
        percentage = (data.score / data.total) * 100 if data.total > 0 else 0

        # 🧾 1. SAVE ATTEMPT
        attempt = UserQuizAttempt(
            clerk_user_id=data.clerk_user_id,
            # user_name=data.user_name,   # ✅ ADD
            score=data.score,
            total=data.total,
            percentage=percentage,
            created_at=datetime.utcnow()
        )

        session.add(attempt)

        # 📊 2. UPDATE / CREATE USER STATS
        stats = session.query(UserStats)\
            .filter(UserStats.clerk_user_id == data.clerk_user_id)\
            .first()

        if not stats:
            stats = UserStats(
                clerk_user_id=data.clerk_user_id,
                total_attempts=0,
                total_score=0,
                best_score=0,
                current_streak=0,
                last_attempt_date=None
            )
            session.add(stats)

        # ➕ update stats
        stats.total_attempts += 1
        stats.total_score += data.score

        # 🏆 best score update
        if data.score > stats.best_score:
            stats.best_score = data.score

        # 🔥 STREAK LOGIC
        today = datetime.utcnow().date()

        if stats.last_attempt_date:
            last_date = stats.last_attempt_date.date()

            if last_date == today - timedelta(days=1):
                stats.current_streak += 1
            elif last_date != today:
                stats.current_streak = 1
        else:
            stats.current_streak = 1

        stats.last_attempt_date = datetime.utcnow()

        # 💾 commit
        session.commit()

        return {
            "message": "Quiz saved",
            "streak": stats.current_streak
        }

    except Exception as e:
        session.rollback()
        return {"error": str(e)}

    finally:
        session.close()

    

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    session = SessionLocal()
    
    attempts = session.query(UserQuizAttempt)\
        .filter(UserQuizAttempt.clerk_user_id == user_id)\
        .order_by(UserQuizAttempt.created_at.desc())\
        .all()

    total_attempts = len(attempts)
    stats = session.query(UserStats)\
    .filter(UserStats.clerk_user_id == user_id)\
    .first()

    avg_score = (stats.total_score / stats.total_attempts) if stats.total_attempts else 0
    if total_attempts == 0:
        return {
            "total_attempts": 0,
            "avg_score": 0,
            "best_score": 0,
            "history": []
        }

    avg_score = sum(a.percentage for a in attempts) / total_attempts
    best_score = max(a.percentage for a in attempts)
    

    history = [
        {
            "date": a.created_at,
            "score": a.score,
            "total": a.total,
            "percentage": a.percentage
        }
        for a in attempts
    ]

    session.close()

    return {
    "total_attempts": stats.total_attempts if stats else 0,
    "avg_score": round(avg_score, 2),
    "best_score": stats.best_score if stats else 0,
    "streak": stats.current_streak if stats else 0,
    "history": history
}

@app.get("/api/digest/weekly")
def get_weekly_digest():
    session = SessionLocal()

    cutoff = datetime.utcnow() - timedelta(days=7)

    articles = session.query(Article)\
        .filter(Article.created_at >= cutoff)\
        .order_by(Article.exam_relevance_score.desc())\
        .limit(30)\
        .all()

    session.close()

    return {
        "count": len(articles),
        "articles": [article_to_dict(a) for a in articles]
    }



@app.get("/api/leaderboard")
def leaderboard():
    session = SessionLocal()

    users = session.query(
        UserQuizAttempt.clerk_user_id,
        # UserQuizAttempt.user_name,   # ✅ ADD
        func.avg(UserQuizAttempt.percentage).label("avg_score"),
        func.max(UserQuizAttempt.percentage).label("best_score"),
        func.count().label("attempts")
    ).group_by(UserQuizAttempt.clerk_user_id)\
     .order_by(func.avg(UserQuizAttempt.percentage).desc())\
     .limit(10).all()

    session.close()

    return [
        {
            "user_id": u[0],
            # "name": u[1],   # ✅ ADD
            "avg_score": round(u[1], 2),
            "best_score": u[2],
            "attempts": u[3]
        }
        for u in users
    ]