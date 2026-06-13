// JSX stands for JavaScript XML, a syntax extension for JavaScript primarily used with React to describe what the user interface should look lik

import { useState, useEffect } from 'react';
import { getCategory, getCategories, getStats, searchNews, getRecent } from '../api';
import NewsCard from '../components/NewsCard';
import CategorySidebar from '../components/CategorySidebar';
import SkeletonCard from '../components/SkeletonCard';
export default function Home({ onArticleClick, searchQuery }) {
  const [articles,   setArticles]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats,      setStats]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories));
    getStats().then(r => setStats(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = searchQuery
      ? searchNews(searchQuery)
      : selected
        ? getCategory(selected)
        : getRecent();

    fetch.then(r => {
      setArticles(r.data.articles || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selected, searchQuery]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* {stats && (
//         <div className="bg-orange-50 border-b border-orange-100 px-6 py-2">
//           <p className="text-xs text-orange-700">
//             📊 <strong>{stats.total_articles}</strong> articles processed &nbsp;|&nbsp;
//             Today: <strong>{stats.today_articles}</strong> &nbsp;|&nbsp;
//             Top: <em>{stats.top_article_today}</em>
//           </p>
//         </div>
//       )} */}

//       {stats && (
//   <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-6 py-3">
//     <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs">
//       <span className="text-orange-700">
//         📊 <strong>{stats.total_articles}</strong> total articles
//       </span>
//       <span className="text-orange-600">
//         🗓️ Today: <strong>{stats.today_articles}</strong>
//       </span>
//       <span className="text-orange-600 hidden md:block">
//         🏆 Top: <em>{stats.top_article_today}</em>
//       </span>
//       <span className="ml-auto text-gray-400">
//         Auto-updates every 6 hours
//       </span>
//     </div>
//   </div>
// )}
      

//       <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

//   {/* Sidebar */}
//   <div className="w-64 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
//     <CategorySidebar
//       categories={categories}
//       selected={selected}
//       onSelect={setSelected}
//     />
//   </div>

//   {/* Articles */}
//   <div className="flex-1 overflow-y-auto h-[calc(100vh-80px)]">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-lg font-bold text-gray-800">
//               {searchQuery
//                 ? `Results for "${searchQuery}"`
//                 : selected || "Today's Current Affairs"}
//             </h1>
//             <span className="text-sm text-gray-400">{articles.length} articles</span>
//           </div>

//           {loading ? (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//     {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
//   </div>
// ) : articles.length === 0 ? (
//   // <div className="text-center py-20 text-gray-400">No articles found.</div>
//   <div className="text-center py-20">
//   <div className="text-5xl mb-4">📭</div>
//   <p className="text-gray-500 font-medium">No articles found</p>
//   <p className="text-gray-400 text-sm mt-1">
//     Try a different category or check back after next pipeline run
//   </p>
// </div>
// ) : (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//     {articles.map(a => (
//       <NewsCard key={a.id} article={a} onClick={onArticleClick} />
//     ))}
//   </div>
// )}
        
//         </div>
//       </div>
//     </div>
//   );
// }

return (
  <div className="min-h-screen bg-gray-50">
    {/* Stats bar */}
    {stats && (
      <div className="bg-orange-50 border-b border-orange-100 px-4 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-orange-700">
          <span>📊 <strong>{stats.total_articles}</strong> total articles</span>
          <span>🗓️ Today: <strong>{stats.today_articles}</strong></span>
          <span className="ml-auto text-gray-400 hidden md:block">Auto-updates every 6 hours</span>
        </div>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Mobile: horizontal category scroll */}
      <div className="md:hidden overflow-x-auto pb-2 mb-4">
        <div className="flex gap-2 w-max">
          <button
            onClick={() => setSelected(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
              ${!selected ? 'bg-orange-400 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            All News
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelected(cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                ${selected === cat.name
                  ? 'bg-orange-400 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'}`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: sidebar + grid layout */}
      <div className="flex gap-6">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block w-64 shrink-0">
          <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
            Categories
          </h2>
          <button
            onClick={() => setSelected(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 font-medium
              ${!selected ? 'bg-orange-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            📰 All News
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelected(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1
                ${selected === cat.name
                  ? 'bg-orange-400 text-white font-medium'
                  : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {cat.name}
              <span className="float-right text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base md:text-lg font-bold text-gray-800">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selected || "Today's Current Affairs"}
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
              <p className="text-gray-400 text-sm mt-1">Try a different category</p>
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
  </div>
)};