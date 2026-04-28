
from groq import Groq
import json
import os
from dotenv import load_dotenv
from pipeline.database import SessionLocal, Article, Quiz

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

QUIZ_PROMPT = """You are an expert question setter for Indian government exams (UPSC, SSC, Banking).

Based on the news article below, generate exactly 3 multiple choice questions.

Return ONLY valid JSON, no extra text:
{{
  "questions": [
    {{
      "question": "clear factual question",
      "option_a": "option text",
      "option_b": "option text", 
      "option_c": "option text",
      "option_d": "option text",
      "correct": "A",
      "explanation": "why this answer is correct, in one sentence"
    }}
  ]
}}

Rules:
- Questions must be factual, not opinion-based
- Options must be plausible but only one correct
- Focus on: names, numbers, places, dates, firsts, ranks
- Style should match actual UPSC/SSC MCQ pattern

Article Title: {title}
Article Summary: {summary}
Important Facts: {facts}
"""

def generate_quiz_for_article(article):
    prompt = QUIZ_PROMPT.format(
        title=article.title,
        summary=article.summary,
        facts=", ".join(article.important_facts or [])
    )

    try:
        response = client.chat.completions.create(
            # model="llama-3.3-70b-versatile",
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
            temperature=0.3
        )

        raw = response.choices[0].message.content.strip()
        data = json.loads(raw)
        return data.get("questions", [])

    except Exception as e:
        print(f"  ❌ Quiz gen failed: {e}")
        return []


def generate_daily_quiz():
    """Generate quizzes for today's top articles."""
    session = SessionLocal()
    print("DEBUG START")

    total = session.query(Article).count()
    print(f"Total articles in DB: {total}")
    from datetime import datetime

    today = datetime.now().date()

    # Get today's top 10 articles (score 7+)
    # articles = session.query(Article).filter(
    #     Article.created_at >= today,
    #     Article.exam_relevance_score >= 7
    # ).order_by(Article.exam_relevance_score.desc()).limit(10).all()
    articles = session.query(Article).filter(
    Article.exam_relevance_score >= 5
).order_by(Article.exam_relevance_score.desc()).limit(10).all()

    print(f"\n🧠 Generating quizzes for {len(articles)} articles...")

    total_saved = 0

    for article in articles:
        # Skip if quiz already exists for this article
        existing = session.query(Quiz).filter_by(
            article_id=article.id
        ).first()
        if existing:
            print(f"  ⏭️ Already has quiz: {article.title[:50]}")
            continue

        print(f"  📝 Generating: {article.title[:60]}...")
        questions = generate_quiz_for_article(article)

        for q in questions:
            quiz = Quiz(
                article_id  = article.id,
                question    = q.get("question"),
                option_a    = q.get("option_a"),
                option_b    = q.get("option_b"),
                option_c    = q.get("option_c"),
                option_d    = q.get("option_d"),
                correct     = q.get("correct"),
                explanation = q.get("explanation"),
                category    = article.category
            )
            session.add(quiz)
            total_saved += 1

        import time
        time.sleep(1)

    session.commit()
    session.close()
    print(f"\n✅ {total_saved} quiz questions saved")
    return total_saved