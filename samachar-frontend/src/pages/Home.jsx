import { useState, useEffect } from 'react';

import {
  getCategory,
  searchNews,
  getRecent,
} from '../api';

import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Home({
  onArticleClick,
  searchQuery,
  selectedCategory,
}) {
  const [articles, setArticles] = useState([]);
  const [stats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);

    setLoading(true);

    const fetchArticles = searchQuery
      ? searchNews(searchQuery)
      : selectedCategory
        ? getCategory(selectedCategory)
        : getRecent();

    fetchArticles
      .then((response) => {
        console.log("API Response:", response.data);

        setArticles(response.data.articles || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
        setLoading(false);
      });

  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* STATS */}
      {stats && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-6 py-3">

          <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs">

            <span className="text-orange-700">
              📊 <strong>{stats.total_articles}</strong> total articles
            </span>

            <span className="text-orange-600">
              🗓️ Today: <strong>{stats.today_articles}</strong>
            </span>

            <span className="text-orange-600 hidden md:block">
              🏆 Top: <em>{stats.top_article_today}</em>
            </span>

            <span className="ml-auto text-gray-400">
              Auto-updates every 6 hours
            </span>

          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-4">

        <div>

          {/* PAGE HEADER */}
          <div className="flex items-center justify-between mb-4">

            <h1 className="text-lg font-bold text-gray-800">

              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory
                  ? selectedCategory
                  : "Today's Current Affairs"}

            </h1>

            <span className="text-sm text-gray-400">
              {articles.length} articles
            </span>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}

            </div>

          ) : articles.length === 0 ? (

            /* EMPTY STATE */
            <div className="text-center py-20">

              <div className="text-5xl mb-4">
                📭
              </div>

              <p className="text-gray-500 font-medium">
                No articles found
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Try a different category or check back after the next pipeline run
              </p>

            </div>

          ) : (

            /* ARTICLES */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={onArticleClick}
                />
              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}