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
    created_at  = Column(DateTime, default=datetime.now)

def init_db():
    """Creates all tables if they don't exist."""
    Base.metadata.create_all(bind=engine) #👉 Creates table automatically in DB
    print("✅ Database tables ready")


def save_articles(processed_articles): #This is your main DB write function
    """
    Saves a list of processed articles to DB.
    Skips duplicates automatically (via article_hash).
    """
    import hashlib
    session = SessionLocal()
    saved = 0
    skipped = 0

    for article in processed_articles:
        # Create hash from title for dedup
        hash_input = article.get("title", "")[:60].lower().strip()
        article_hash = hashlib.md5(hash_input.encode()).hexdigest()

        # Check if already exists
        exists = session.query(Article).filter_by(
            article_hash=article_hash
        ).first()

        if exists:
            skipped += 1
            continue

        # Save new article (Create DB object)
        db_article = Article(  #Python dict → DB row
            article_hash        = article_hash,
            title               = article.get("title", ""),
            category            = article.get("category", ""),
            summary             = article.get("summary", ""),
            key_points          = article.get("key_points", []),
            important_facts     = article.get("important_facts", []),
            exam_relevance_score = article.get("exam_relevance_score", 0),
            is_exam_relevant    = article.get("is_exam_relevant", True),
            verification_status = article.get("verification_status", ""),
            source_name         = article.get("source", ""),
            source_url          = article.get("source_url", ""),
            published_at        = article.get("published", "")
        )
        session.add(db_article)
        saved += 1

    session.commit()   #👉 Actually writes to DB
    session.close()

    print(f"💾 DB: {saved} new articles saved, {skipped} already existed")
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