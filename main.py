# from pipeline.fetcher import fetch_headlines,save_raw_articles #this is called modular code structure
# articles = fetch_headlines()

# if articles:

#     # 🧪 DEBUG BLOCK (yahin lagana hai)
#     import json

#     for i, article in enumerate(articles):
#         try:
#             json.dumps(article)
#         except Exception as e:
#             print(f"\n❌ Problem in article {i}")
#             for key, value in article.items():
#                 print(key, type(value), value)
#             break

#     # 💾 SAVE (ye baad me aayega)
#     save_raw_articles(articles)

# else:
#     print("⚠️ No articles fetched. Check your internet or feed URLs.")

# import json
# from pipeline.fetcher import fetch_headlines, save_raw_articles
# from pipeline.processor import process_all
# from datetime import datetime

# if __name__ == "__main__":
#     print("🚀 SAMACHAR.AI Pipeline Starting...\n")

#     # Step 1: Fetch
#     articles = fetch_headlines()

#     if not articles:
#         print("⚠️ No articles fetched.")
#         exit()

#     # Step 2: Save raw
#     save_raw_articles(articles)

#     # Step 3: Process through Claude
#     processed = process_all(articles)

#     # Step 4: Save processed
#     if processed:
#         today = datetime.now().strftime("%Y-%m-%d")
#         filepath = f"data/processed_{today}.json"

#         with open(filepath, "w", encoding="utf-8") as f:
#             json.dump(processed, f, indent=2, ensure_ascii=False)

#         print(f"\n💾 Saved {len(processed)} processed articles to {filepath}")
#         print("\n📰 Sample output:")
#         print(json.dumps(processed[0], indent=2))


#AFTER POSTGRESQL

from pipeline.fetcher import fetch_headlines, save_raw_articles
from pipeline.processor import process_all
from pipeline.database import init_db, save_articles, get_todays_articles
from datetime import datetime

if __name__ == "__main__":
    print("🚀 SAMACHAR.AI Pipeline Starting...\n")

    # Initialize DB tables on first run
    init_db()

    # Fetch
    articles = fetch_headlines()
    if not articles:
        print("⚠️ No articles fetched.")
        exit()

    # Save raw backup
    save_raw_articles(articles)

    # Process through Groq
    processed = process_all(articles)

    # Save to database (not JSON anymore)
    if processed:
        save_articles(processed)

    # Verify it worked
    todays = get_todays_articles()
    print(f"\n📊 Total in DB today: {len(todays)}")
    print("\nTop 3 by relevance score:")
    for a in todays[:3]:
        print(f"  [{a.exam_relevance_score}] {a.title[:60]} | {a.category}")