export default function Navbar({ onSearch }) {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div>
        <span className="text-2xl font-bold text-orange-400">SAMACHAR</span>
        <span className="text-2xl font-bold text-white">.AI</span>
        <p className="text-xs text-gray-400">AI-Powered Current Affairs</p>
      </div>
      <input
        onChange={e => onSearch(e.target.value)}
        placeholder="Search news..."
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      />
    </nav>
  );
}