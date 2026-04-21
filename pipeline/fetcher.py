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
from datetime import datetime

# These are your news sources - we'll add more later
RSS_FEEDS = {
    "NDTV India": "https://feeds.feedburner.com/ndtvnews-india-news",
    "The Hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
    "PIB": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
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
    return all_articles


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


