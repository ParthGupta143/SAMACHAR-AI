import { CATEGORY_COLORS } from './CategorySidebar';

export default function NewsCard({ article, onClick }) {
  const colorClass =
    CATEGORY_COLORS[article.category] ||
    "bg-gray-100 text-gray-700";

  const score = article.exam_relevance_score;

  return (
    <div
      onClick={() => onClick(article.id)}
      className="bg-white rounded-xl border border-gray-200 p-4
                 hover:shadow-md hover:border-orange-300
                 cursor-pointer transition-all duration-200"
    >
      {/* Category + Score */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${colorClass}`}
        >
          {article.category}
        </span>

        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full
            ${
              score >= 8
                ? "bg-red-100 text-red-600"
                : score >= 6
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          ★ {score}
        </span>
      </div>

      {/* TITLE */}
      <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {article.title}
      </h2>

      {/* SUMMARY */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
        {article.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {article.source_name}
        </span>

        <span
          className={`text-xs px-2 py-0.5 rounded-full
            ${
              article.verification_status === "Verified"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {article.verification_status}
        </span>
      </div>
    </div>
  );
}