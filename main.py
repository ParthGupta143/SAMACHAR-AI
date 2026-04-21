from pipeline.fetcher import fetch_headlines,save_raw_articles #this is called modular code structure
articles = fetch_headlines()

if articles:

    # 🧪 DEBUG BLOCK (yahin lagana hai)
    import json

    for i, article in enumerate(articles):
        try:
            json.dumps(article)
        except Exception as e:
            print(f"\n❌ Problem in article {i}")
            for key, value in article.items():
                print(key, type(value), value)
            break

    # 💾 SAVE (ye baad me aayega)
    save_raw_articles(articles)

else:
    print("⚠️ No articles fetched. Check your internet or feed URLs.")