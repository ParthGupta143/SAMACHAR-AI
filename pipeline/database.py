from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text, DateTime, JSON  #defines table structure and column types
from sqlalchemy.ext.declarative import declarative_base #SQLAIchemy tools: Base->used to define tables
from sqlalchemy.orm import sessionmaker #session->used to talk to db
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()  

# Connect to database
engine = create_engine(os.getenv("DATABASE_URL")) #👉 This connects your app → PostgreSQL
SessionLocal = sessionmaker(bind=engine) #engine = connection, sessionlocal = db session
Base = declarative_base()  #base = table blueprint


# This is your articles table — every column maps to a JSON field(Table Design)
class Article(Base):
    __tablename__ = "articles"  #this create article table

    id                  = Column(Integer, primary_key=True, index=True) #primary key
    article_hash        = Column(String(64), unique=True, index=True)  #👉 Prevents duplicates at DB level(dedup logic)
    title               = Column(Text, nullable=False) #<--
    category            = Column(String(100), index=True)
    summary             = Column(Text)                 #core fields--->
    key_points          = Column(JSON)  #<---
    important_facts     = Column(JSON)  #json field--->👉 You’re storing lists directly → very good design
    #for hindi translation: Bilingual
    # title_hi       = Column(Text, nullable=True)
    # summary_hi     = Column(Text, nullable=True)
    # key_points_hi  = Column(JSON, nullable=True)
    # important_facts_hi = Column(JSON, nullable=True)
    exam_relevance_score = Column(Integer)  #scoring
    is_exam_relevant    = Column(Boolean, default=True)
    verification_status = Column(String(50))
    source_name         = Column(String(100)) #<---
    source_url          = Column(Text)
    published_at        = Column(String(100))#metadata--->
    created_at          = Column(DateTime, default=datetime.now) #👉 Auto-adds time when row is inserted(Timestamp)

class Quiz(Base):
    __tablename__ = "quizzes"

    id          = Column(Integer, primary_key=True, index=True)
    article_id  = Column(Integer, index=True)
    question    = Column(Text)
    option_a    = Column(Text)
    option_b    = Column(Text)
    option_c    = Column(Text)
    option_d    = Column(Text)
    correct     = Column(String(1))  # "A", "B", "C", or "D"
    explanation = Column(Text)
    category    = Column(String(100))
    
    # created_at  = Column(DateTime, default=datetime.now)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserQuizAttempt(Base):
    __tablename__ = "user_quiz_attempts"

    id           = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String(200), index=True)  # Clerk se aata hai

    # user_name = Column(String(200)) 
    # user_id = Column(String, index=True)      
    score        = Column(Integer)   # kitne sahi
    total        = Column(Integer)   # total questions
    percentage   = Column(Integer)   # score/total * 100
    created_at   = Column(DateTime, default=datetime.now)

class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, unique=True, index=True)
    
    total_attempts = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    best_score = Column(Integer, default=0)

    current_streak = Column(Integer, default=0)
    last_attempt_date = Column(DateTime)

def init_db():
    """Creates all tables if they don't exist."""
    Base.metadata.create_all(bind=engine) #👉 Creates table automatically in DB
    print("✅ Database tables ready")


def save_articles(processed_articles):
    from rapidfuzz import fuzz
    import hashlib
    
    session = SessionLocal()
    saved = 0
    skipped = 0

    # Fetch existing titles from DB for fuzzy match
    existing_titles = [a.title for a in session.query(Article.title).all()]

    for article in processed_articles:
        title = article.get("title", "")
        
        # 1. Exact hash dedup
        hash_input = title[:60].lower().strip()
        article_hash = hashlib.md5(hash_input.encode()).hexdigest()
        exists = session.query(Article).filter_by(article_hash=article_hash).first()
        if exists:
            skipped += 1
            continue

        # 2. Fuzzy dedup — skip if >85% similar to any existing title
        is_duplicate = False
        for existing_title in existing_titles:
            similarity = fuzz.ratio(title.lower(), existing_title.lower())
            if similarity > 85:
                is_duplicate = True
                print(f"🔁 Fuzzy duplicate skipped: {title[:50]} (~{similarity}% match)")
                break
        
        if is_duplicate:
            skipped += 1
            continue

        # Save new article
        db_article = Article(
    article_hash        = article_hash,
    title               = title,
    category            = article.get("category", ""),
    summary             = article.get("summary", ""),
    key_points          = article.get("key_points", []),
    important_facts     = article.get("important_facts", []),
    exam_relevance_score = article.get("exam_relevance_score", 0),
    is_exam_relevant    = article.get("is_exam_relevant", True),
    verification_status = article.get("verification_status", ""),
    source_name         = article.get("source", ""),
    source_url          = article.get("source_url", ""),
    published_at        = article.get("published", ""),
    created_at          = datetime.utcnow()   # 🔥 ADD THIS LINE
)
        session.add(db_article)
        existing_titles.append(title)  # add to list so next article also checked against it
        saved += 1

    session.commit()
    session.close()
    print(f"💾 DB: {saved} new articles saved, {skipped} duplicates skipped")
    return saved


def get_todays_articles():
    """Quick test function — fetch today's articles from DB."""
    session = SessionLocal()
    today = datetime.now().date()

    articles = session.query(Article).filter(
        Article.created_at >= today   #👉 Fetch today’s data
    ).order_by(Article.exam_relevance_score.desc()).all()   #👉 Sorted by importance

    session.close()
    return articles 
#FULL FLOW: fetch → deduplicate → AI → save_articles → DB