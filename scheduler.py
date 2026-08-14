# print("SCHEDULER FILE LOADED")
# from apscheduler.schedulers.blocking import BlockingScheduler
# from pipeline.fetcher import fetch_headlines, save_raw_articles
# from pipeline.processor import process_all
# from pipeline.database import init_db, save_articles

# def run_pipeline():
#     print("\n⏰ Scheduled run starting...")
#     init_db()
#     articles = fetch_headlines()
#     if articles:
#         save_raw_articles(articles)
#         processed = process_all(articles)
#         if processed:
#             save_articles(processed)
#     print("✅ Scheduled run complete\n")

# scheduler = BlockingScheduler()
# scheduler.add_job(run_pipeline, 'interval', hours=6)

# print("🕐 Scheduler started — pipeline runs every 6 hours")
# print("   Next run: immediately on start")

# run_pipeline()  # Run once immediately on start
# scheduler.start()

# def run_pipeline():
#     print("\n⏰ Scheduled run starting...")

#     print("STEP 1")
#     init_db()

#     print("STEP 2")
#     articles = fetch_headlines()

#     print("STEP 3")
#     if articles:
#         save_raw_articles(articles)

#     print("STEP 4")
#     processed = process_all(articles)

#     print("STEP 5")
#     if processed:
#         save_articles(processed)

#     print("STEP 6")
#     print("✅ Scheduled run complete\n")




from apscheduler.schedulers.blocking import BlockingScheduler
from pipeline.fetcher import fetch_headlines, save_raw_articles
from pipeline.processor import process_all
from pipeline.database import init_db, save_articles

print("SCHEDULER FILE LOADED")


def run_pipeline():
    print("\n⏰ Scheduled run starting...")

    try:
        print("STEP 1: Initializing DB")
        init_db()

        print("STEP 2: Fetching headlines")
        articles = fetch_headlines()

        if not articles:
            print("❌ No articles fetched")
            return

        print(f"✅ Fetched {len(articles)} articles")

        print("STEP 3: Saving raw articles")
        save_raw_articles(articles)

        print("STEP 4: Processing articles")
        processed = process_all(articles)

        if not processed:
            print("❌ No processed articles")
            return

        print(f"✅ Processed {len(processed)} articles")

        print("STEP 5: Saving to database")
        save_articles(processed)

        print("✅ Scheduled run complete\n")

    except Exception as e:
        print(f"❌ PIPELINE ERROR: {e}")
        import traceback
        traceback.print_exc()


print("🕐 Running pipeline immediately...")

run_pipeline()

scheduler = BlockingScheduler()
scheduler.add_job(run_pipeline, "interval", hours=6)

print("🕐 Scheduler started — pipeline runs every 6 hours")

scheduler.start()