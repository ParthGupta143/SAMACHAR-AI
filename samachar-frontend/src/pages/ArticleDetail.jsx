import { useState, useEffect } from 'react';
import { getArticle } from '../api';
import { CATEGORY_COLORS } from '../components/CategorySidebar';

export default function ArticleDetail({ articleId, onBack }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticle(articleId).then(r => setArticle(r.data));
  }, [articleId]);

  if (!article) return (
    <div className="text-center py-20 text-gray-400">Loading...</div>
  );

  const colorClass = CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="text-orange-500 text-sm mb-6 hover:underline"
      >
        ← Back to News
      </button>

      <span className={`text-xs font-medium px-3 py-1 rounded-full ${colorClass}`}>
        {article.category}
      </span>

      <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-4">{article.title}</h1>

      <div className="flex gap-4 text-xs text-gray-500 mb-6">
        <span>📰 {article.source_name}</span>
        <span>⭐ Score: {article.exam_relevance_score}/10</span>
        <span className="text-green-600">✅ {article.verification_status}</span>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mb-6">
        <p className="text-sm text-gray-800 leading-relaxed">{article.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-gray-800 mb-2">Key Points</h2>
        <ul className="space-y-2">
          {article.key_points?.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-orange-400 font-bold">→</span> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <h2 className="font-bold text-gray-800 mb-2">📌 Important for Exam</h2>
        <ul className="space-y-1">
          {article.important_facts?.map((f, i) => (
            <li key={i} className="text-sm text-blue-800">• {f}</li>
          ))}
        </ul>
      </div>

      
       <a href={article.source_url}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-6 text-sm text-orange-500 hover:underline">
        Read full article →
      </a>
    </div>
  );
}