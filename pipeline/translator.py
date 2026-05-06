from groq import Groq
import json, os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

TRANSLATE_PROMPT = """Translate the following JSON fields from English to Hindi.
Return ONLY valid JSON, no extra text.

Rules:
- Translate naturally, not word by word
- Keep proper nouns (names, places, organizations) in English
- Keep numbers and dates as is
- Summary should be in simple Hindi (not formal Sanskrit-heavy Hindi)
- Use language that UP/Bihar board students can easily understand

Input JSON:
{input_json}

Return same JSON structure with Hindi translations."""


def translate_article_to_hindi(article_id):
    from pipeline.database import SessionLocal, Article
    session = SessionLocal()

    article = session.query(Article).filter(Article.id == article_id).first()

    if not article:
        session.close()
        return None

    # Already translated
    if article.title_hi:
        session.close()
        return article

    input_data = {
        "title": article.title,
        "summary": article.summary,
        "key_points": article.key_points,
        "important_facts": article.important_facts
    }

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{
                "role": "user",
                "content": TRANSLATE_PROMPT.format(
                    input_json=json.dumps(input_data, ensure_ascii=False)
                )
            }],
            max_tokens=1024,
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()
        translated = json.loads(raw)

        article.title_hi        = translated.get("title")
        article.summary_hi      = translated.get("summary")
        article.key_points_hi   = translated.get("key_points")
        article.important_facts_hi = translated.get("important_facts")

        session.commit()
        print(f"✅ Translated: {article.title[:50]}")

    except Exception as e:
        print(f"❌ Translation failed: {e}")

    session.close()
    return article