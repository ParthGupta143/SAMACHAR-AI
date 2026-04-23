const CATEGORY_COLORS = {
  "Politics & Governance":        "bg-blue-100 text-blue-800",
  "International Relations":      "bg-purple-100 text-purple-800",
  "Economy & Banking":            "bg-green-100 text-green-800",
  "Science & Technology":         "bg-cyan-100 text-cyan-800",
  "Defense & Security":           "bg-red-100 text-red-800",
  "Environment & Ecology":        "bg-emerald-100 text-emerald-800",
  "Judiciary & Legal":            "bg-yellow-100 text-yellow-800",
  "Government Schemes & Policies":"bg-orange-100 text-orange-800",
};

export { CATEGORY_COLORS };

export default function CategorySidebar({ categories, selected, onSelect }) {
  return (
    <div className="w-64 shrink-0">
      <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
        Categories
      </h2>
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 font-medium
          ${!selected ? 'bg-orange-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
      >
        📰 All News
      </button>
      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
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
  );
}