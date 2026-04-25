import { useState, useEffect } from 'react';
import { getWeeklyDigest } from '../api';
import { CATEGORY_COLORS } from '../components/CategorySidebar';

export default function WeeklyDigest({ onBack, onArticleClick }) {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [meta,     setMeta]     = useState(null);

  useEffect(() => {
    getWeeklyDigest().then(r => {
      setArticles(r.data.articles || []);
      setMeta({ start: r.data.week_start, end: r.data.week_end });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Loading digest...</div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <button onClick={onBack} className="text-orange-500 text-sm mb-6 hover:underline">
        ← Back to News
      </button>

      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-1">📋 Weekly Digest</h1>
        <p className="text-orange-100 text-sm">
          Top {articles.length} exam-relevant news · {meta?.start} to {meta?.end}
        </p>
        <p className="text-orange-100 text-xs mt-2">
          Ranked by AI exam relevance score
        </p>
      </div>

      {/* Article list */}
      <div className="space-y-3">
        {articles.map((article, index) => {
          const colorClass = CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-700";

          return (
            <div
              key={article.id}
              onClick={() => onArticleClick(article.id)}
              className="bg-white border border-gray-200 rounded-xl p-4 
                         hover:border-orange-300 hover:shadow-sm cursor-pointer 
                         transition-all flex gap-4 items-start"
            >
              {/* Rank number */}
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center 
                justify-center text-sm font-bold
                ${index < 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-orange-400 font-bold">
                    ★ {article.exam_relevance_score}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {article.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Updated daily · Powered by SAMACHAR.AI
        </p>
      </div>
    </div>
  );
}