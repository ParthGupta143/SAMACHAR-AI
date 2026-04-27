#               #___COLLECTION LAYER___#  

# import feedparser  #feedparser: reads RSS FEEDS(very imp for news apps)
# import json   #used to save data in json format
# from datetime import datetime  # use to get current date and time

# # These are your news sources, later we`ll add more

# RSS_FEEDS = {

#     "NDTV India": "https://feeds.feedburner.com/ndtvnews-india-news",
#     "The Hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
#     "PIB": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",

# }
# #FUNCTION: 1
# def fetch_headlines():
#     """Fetches raw headlines from all sources
#     returns a list of article dictionaries"""
    
#     all_articles=[]    #empty list to store everything

#     for source_name, feed_url in RSS_FEEDS.items():  #iterates over dictionaries, source_name:NDTV, feed_url: actual RSS link
#         print(f"\n Fetching from {source_name}...") 

#         try:  #prevent crash if any feeds 
#             feed = feedparser.parse(feed_url) #core line, send request to RSS URL, convert xml -> python object
#             for entry in feed.entries[:10]:  #feed_entries = list of article, max 10 for now
#                 """now converting rss data into my own structered format, .get(key,default) = prevent crash if field is missing"""
#                 article = {
#                     "titile":entry.get("title","No title"), #article headline
#                     "url":entry.get("link",""), #link to article
#                     "source":source_name,  #NDTV etc
#                     #"published": entry.get("published", str(datetime.now())), #published date (fallback = current time)##
#                     "published": str(entry.get("published", datetime.now())),
#                     "summary_raw":entry.get("summary","") #short description from RSS
#                 }
#                 all_articles.append(article)  #store article in master list
#                 print(f"{article['titile'][:80]}...") #show first 80 character of articles, helps debug + track progress
#         except Exception as e:
#             print(f"failed to fetch{source_name}:{e}")
#     print(f"\n Total articles fetched:{len(all_articles)}")
#     return all_articles #this lets u to use data in next steps like: AI processing, saving, filtering

# #FUNCTION: 2
# def save_raw_articles(articles):
#     """saved fetched articles to a json file with today`s date"""
#     today = datetime.now().strftime("%Y-%m-%d")
#     filepath = f"data/raw/{today}.json"   #create storage path for date

#     with open(filepath,'w',encoding='utf-8') as f:   #open file in write mode, utf-8 = support hindi/unicode text
#         json.dump(articles,f,indent=2,ensure_ascii=False)  #save JSON,indent=2 ->pretty format, ensure_ascii=False ->keeps hindi readable
#     print(f"\n Saved{len(articles)}  articles to {filepath}")  #confirmation shows success message
#     return filepath   #use later if u want to process that file or log file location



import feedparser
import json
import hashlib
from datetime import datetime

# These are your news sources - we'll add more later
# RSS_FEEDS = {
#     # Government - highest value for exams
#     "PIB":          "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1",
#     "PIB Science":  "https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1",

#     # National news
#     "The Hindu":    "https://www.thehindu.com/news/national/feeder/default.rss",
#     "Hindu Business": "https://www.thehindu.com/business/feeder/default.rss",
#     "Indian Express": "https://indianexpress.com/section/india/feed/",

#     # Economy & Finance
#     "LiveMint":     "https://www.livemint.com/rss/news",
#     "Economic Times": "https://economictimes.indiatimes.com/rssfeedstopstories.cms",

#     # International
#     "Hindu World":  "https://www.thehindu.com/news/international/feeder/default.rss",

#     # Science & Environment
#     "Hindu Science": "https://www.thehindu.com/sci-tech/feeder/default.rss",
#     # "Down To Earth": "https://www.downtoearth.org.in/rss/all",
# }
RSS_FEEDS = {
    # ═══ GOVERNMENT SOURCES (highest value) ═══
    "PIB":                  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1",
    "PIB Science":          "https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1",
    "PIB Economy":          "https://pib.gov.in/RssMain.aspx?ModId=3&Lang=1",
    # "RBI":                  "https://www.rbi.org.in/Scripts/rss.aspx",
    "Ministry of Finance":  "https://pib.gov.in/RssMain.aspx?ModId=4&Lang=1",
    "Ministry of Defence":  "https://pib.gov.in/RssMain.aspx?ModId=14&Lang=1",
    "Ministry of External": "https://pib.gov.in/RssMain.aspx?ModId=8&Lang=1",

    # ═══ THE HINDU (most trusted for UPSC) ═══
    "Hindu National":       "https://www.thehindu.com/news/national/feeder/default.rss",
    "Hindu International":  "https://www.thehindu.com/news/international/feeder/default.rss",
    "Hindu Business":       "https://www.thehindu.com/business/feeder/default.rss",
    "Hindu Science":        "https://www.thehindu.com/sci-tech/feeder/default.rss",
    "Hindu Opinion":        "https://www.thehindu.com/opinion/feeder/default.rss",
    "Hindu Environment":    "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",

    # ═══ ECONOMY & BANKING ═══
    "Economic Times":       "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
    "ET Economy":           "https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms",
    "ET Policy":            "https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1415354936.cms",
    "LiveMint Economy":     "https://www.livemint.com/rss/economy",
    "LiveMint Politics":    "https://www.livemint.com/rss/politics",
    "Business Standard":    "https://www.business-standard.com/rss/latest.rss",
    "Financial Express":    "https://www.financialexpress.com/feed/",

    # ═══ NATIONAL NEWS ═══
    "Indian Express":       "https://indianexpress.com/section/india/feed/",
    "IE Politics":          "https://indianexpress.com/section/political-pulse/feed/",
    "IE Economy":           "https://indianexpress.com/section/business/economy/feed/",
    "NDTV India":           "https://feeds.feedburner.com/ndtvnews-india-news",
    "NDTV World":           "https://feeds.feedburner.com/ndtvnews-world-news",

    # ═══ ENVIRONMENT & SCIENCE ═══
    "Mint Science":         "https://www.livemint.com/rss/science",
    # "DTE Climate":          "https://www.downtoearth.org.in/rss/climate-change",
    "DTE Governance":       "https://www.downtoearth.org.in/rss/governance",
    "Hindu Science Tech":   "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
    "Hindu Agriculture":    "https://www.thehindu.com/news/national/feeder/default.rss",

    # ═══ INTERNATIONAL RELATIONS ═══
    "Hindu World":          "https://www.thehindu.com/news/international/feeder/default.rss",
    "IE World":             "https://indianexpress.com/section/world/feed/",
    "Wire World":           "https://thewire.in/rss/category/world",
    "ET International":     "https://economictimes.indiatimes.com/news/international/world-news/rssfeeds/1441138060.cms",
    # ═══ REPORTS & INDEXES ═══
    "IE Science":           "https://indianexpress.com/section/technology/science/feed/",
    "Wire Government":      "https://thewire.in/rss/category/government",
    "Wire Science":         "https://thewire.in/rss/category/science",
}


def fetch_headlines():
    """
    Fetches raw headlines from all RSS sources.
    Returns a list of article dictionaries.
    """
    all_articles = []

    for source_name, feed_url in RSS_FEEDS.items():
        print(f"\n📡 Fetching from {source_name}...")

        try:
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries[:10]:  # max 10 per source for now
                article = {
                    "title": str(entry.get("title", "No title")),
                    "url": str(entry.get("link", "")),
                    "source": str(source_name),
                    "published": str(entry.get("published", datetime.now())),
                    "summary_raw": str(entry.get("summary", ""))
                }
                all_articles.append(article)
                print(f"  ✅ {article['title'][:80]}...")

        except Exception as e:
            print(f"  ❌ Failed to fetch {source_name}: {e}")

    print(f"\n📦 Total articles fetched: {len(all_articles)}")
    
    # NEW LINE:
    all_articles = deduplicate(all_articles)
    
    print(f"📦 After dedup: {len(all_articles)}")
    return all_articles

def deduplicate(articles):
    """Remove duplicate articles based on title similarity"""
    seen = set() #seen: stores hashes you`ve already encountered`
    unique = []  #store final clean articles

    for article in articles:
          # Create a simple hash from first 60 chars of title
        title_key= article['title'][:60].lower().strip()  #[:60] = print only first 60 chars, .strip() = no extra spaces
        #📌 Goal: normalize titles for comparison
        title_hash = hashlib.md5(title_key.encode()).hexdigest()

        if title_hash not in seen:
            seen.add(title_hash)
            unique.append(article)

    duplicates_removed = len(articles) - len(unique)
    if duplicates_removed > 0:
        print(f"🔁 Removed {duplicates_removed} duplicate articles")

    return unique

def save_raw_articles(articles):
    """
    Saves fetched articles to a JSON file with today's date.
    """
    today = datetime.now().strftime("%Y-%m-%d")
    filepath = f"data/raw/{today}.json"

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Saved {len(articles)} articles to {filepath}")
    return filepath



