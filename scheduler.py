from apscheduler.schedulers.blocking import BlockingScheduler
from pipeline.fetcher import fetch_headlines, save_raw_articles
from pipeline.processor import process_all
from pipeline.database import init_db, save_articles

def run_pipeline():
    print("\n⏰ Scheduled run starting...")
    init_db()
    articles = fetch_headlines()
    if articles:
        save_raw_articles(articles)
        processed = process_all(articles)
        if processed:
            save_articles(processed)
    print("✅ Scheduled run complete\n")

scheduler = BlockingScheduler()
scheduler.add_job(run_pipeline, 'interval', hours=6)

print("🕐 Scheduler started — pipeline runs every 6 hours")
print("   Next run: immediately on start")

run_pipeline()  # Run once immediately on start
scheduler.start()