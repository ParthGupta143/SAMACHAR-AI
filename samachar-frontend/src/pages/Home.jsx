// JSX stands for JavaScript XML, a syntax extension for JavaScript primarily used with React to describe what the user interface should look lik

import { useState, useEffect } from 'react';
import { translations } from "../translations";
import { getCategory, searchNews, getRecent } from '../api';
import NewsCard from '../components/NewsCard';
// import CategorySidebar from '../components/CategorySidebar';
import SkeletonCard from '../components/SkeletonCard';
export default function Home({
  onArticleClick,
  searchQuery,
  search,
  selectedCategory,
}) {
  const [articles,   setArticles]   = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [stats,      setStats]      = useState(null);
  const [stats] = useState(null);
  const [loading,    setLoading]    = useState(true);

useEffect(() => {
  console.log("Selected Category:", selectedCategory);

  setLoading(true);

  const fetch = searchQuery
    ? searchNews(searchQuery)
    : selectedCategory
      ? getCategory(selectedCategory)
      : getRecent();

  fetch.then(r => {
    console.log("API Response:", r.data);
    setArticles(r.data.articles || []);
    setLoading(false);
  });
}, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      
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
      

      
      <div className="max-w-7xl mx-auto px-4 py-4">

  


  <div>
    
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-800">
  {searchQuery
    ? `Results for "${searchQuery}"`
    : selectedCategory
      ? selectedCategory
  //      : language === "hi"
  // ? "आज की समसामयिक घटनाएँ"
  : t.todayCA}
</h1>
            <span className="text-sm text-gray-400">{articles.length} articles</span>
          </div>

          {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
) : articles.length === 0 ? (
  
  <div className="text-center py-20">
  <div className="text-5xl mb-4">📭</div>
  <p className="text-gray-500 font-medium">No articles found</p>
  <p className="text-gray-400 text-sm mt-1">
    Try a different category or check back after next pipeline run
  </p>
</div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {articles.map(a => (
      <NewsCard key={a.id} article={a} onClick={onArticleClick} />
    ))}
  </div>
)}
        
        </div>
      </div>
    </div>
  );
}