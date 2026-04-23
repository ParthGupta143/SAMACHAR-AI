from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CATEGORIES = [
    "Politics & Governance", "Economy & Banking", "International Relations",
    "Science & Technology", "Environment & Ecology", "Defense & Security",
    "Government Schemes & Policies", "Reports & Indexes", "Awards & Honors",
    "Appointments & Resignations", "Sports", "Summits & Conferences",
    "Judiciary & Legal", "Agriculture & Rural Development",
    "Important Days", "Books & Authors"
]

SAMACHAR_PROMPT = """You are an AI assistant for Indian government exam preparation (UPSC, SSC CGL, Banking, State PSC).

Analyze the news article below and return ONLY a valid JSON object. No extra text. No markdown. Just raw JSON.

Return this exact structure:
{{
  "title": "clear concise title under 15 words",
  "category": "exactly one from this list: {categories}",
  "summary": "40-50 words, simple language, only facts, complete sentences",
  "key_points": ["point 1", "point 2", "point 3"],
  "important_facts": ["specific number/name/date/rank that could become MCQ option", "another specific fact"],
  "exam_relevance_score": 7,
  "is_exam_relevant": true,
  "verification_status": "Verified"
}}

STRICT RULES:
- category MUST be exactly one string from this list, word for word: {categories}
- NEVER invent a new category. If unsure, pick the closest match.
- Education-related news → use "Government Schemes & Policies"
- is_exam_relevant = false for: celebrity gossip, entertainment, film, viral content, sports scores, weather reports, personal crime
- exam_relevance_score 8-10: major policy, international relations, economy, appointments
- exam_relevance_score 5-7: court orders, state politics, environment data
- exam_relevance_score 1-4: filter these out, too local or minor
- summary must be 40-50 words minimum, factual, no opinions
- important_facts must contain specific data: numbers, names, ranks, dates, firsts, superlatives

Article Title: {title}
Article Content: {content}"""


def process_article(article):  #👉 Takes ONE article → returns processed version
    prompt = SAMACHAR_PROMPT.format(
        categories=", ".join(CATEGORIES),
        title=article["title"],
        content=article.get("summary_raw", article["title"])
    )

    try: #Call AI
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # same model you used in Omni.AI
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
            temperature=0.1  # low temp = more consistent JSON output, less randomness
        )

        raw_response = response.choices[0].message.content.strip()  #Get response or extracts AI output
        processed = json.loads(raw_response)  #convert json i.e. 👉 String → Python dict

    #Add metadata:Give AI output + original data
        processed["source"] = article["source"]
        processed["source_url"] = article["url"]
        processed["published"] = article["published"]

        return processed    

    except json.JSONDecodeError:  #if AI give bad json -> skip
        print(f"  ⚠️ JSON parse failed for: {article['title'][:50]}")
        return None
    except Exception as e:  #if AI give api error -> skip
        print(f"  ❌ API error: {e}")
        return None

#👉 Takes list of articles → processes ALL
def process_all(articles):
    """
    Processes a list of raw articles through GROQ.
    Skips irrelevant ones after processing.
    """
    processed = []
    skipped = 0     #initial setup

    print(f"\n🤖 Sending {len(articles)} articles to GROQ..\n")  #Logginf

    for i, article in enumerate(articles):   #loop through articles
        print(f"[{i+1}/{len(articles)}] Processing: {article['title'][:60]}...")

        result = process_article(article)   #process each result

        if result is None:   #if fail
            skipped += 1
            continue

        if not result.get("is_exam_relevant", False):
            print(f"  🚫 Filtered out (not exam relevant)")
            skipped += 1
            continue

        score = result.get("exam_relevance_score", 0)
        if score < 6:
            print(f"  🚫 Filtered out (low score: {score})")
            skipped += 1
            continue

        print(f"  ✅ Kept | Category: {result['category']} | Score: {score}")
        processed.append(result)

    print(f"\n📊 Results: {len(processed)} kept, {skipped} filtered out")
    return processed