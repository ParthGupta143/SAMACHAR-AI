

//Mobile resposnive

// import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
// import { useState } from 'react';

// // export default function Navbar({ onSearch, onQuiz, onDigest, onHome, onProfile }) {
// export default function Navbar({ onSearch, onQuiz, onDigest, onHome, onProfile}) {
//   // const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50">
      
//       {/* 🔥 TOP ROW */}
//       <div className="flex items-center justify-between">
        
//         {/* Logo */}
//         <div onClick={onHome} className="cursor-pointer">
//           <span className="text-xl md:text-2xl font-bold text-orange-400">SAMACHAR</span>
//           <span className="text-xl md:text-2xl font-bold text-white">.AI</span>
//           <p className="text-[10px] md:text-xs text-gray-400">
//             AI-Powered Current Affairs
//           </p>
//         </div>

//         {/* 🔥 Hamburger (mobile only) */}
//         <SignedOut>
//   <SignInButton mode="modal">
//     <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
//       Login
//     </button>
//   </SignInButton>
// </SignedOut>

// <SignedIn>
//   <button
//     className="text-3xl text-white"
//     onClick={() => setMenuOpen(true)}
//   >
//     ☰
//   </button>
// </SignedIn>
//       </div>

      
//     </nav>
//   );
// }

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';

import { useState } from 'react';
import { translations } from "../translations";
export default function Navbar({
  onSearch,
  onQuiz,
  onDigest,
  onHome,
  onProfile,
  categories = [],
  selectedCategory,
  onCategorySelect,

  language,
  setLanguage,
}) 
{
  const categoryHindi = {
  "Politics & Governance": "राजनीति एवं शासन",
  "Economy & Banking": "अर्थव्यवस्था एवं बैंकिंग",
  "International Relations": "अंतरराष्ट्रीय संबंध",
  "Science & Technology": "विज्ञान एवं प्रौद्योगिकी",
  "Defense & Security": "रक्षा एवं सुरक्षा",
  "Government Schemes & Policies": "सरकारी योजनाएँ एवं नीतियाँ",
  "Environment and Ecology":"पर्यावरण एवं पारिस्थितिकी",
  "Judiciary and Legal" : "न्यायपालिका एवं विधि",
  "Reports and Indexes" : "रिपोर्ट्स एवं सूचकांक"
};
const categoryIcons = {
  "Politics & Governance": "🏛️",
  "Defense & Security": "🛡️",
  "Economy & Banking": "💰",
  "Science & Technology": "🚀",
  "Environment & Ecology": "🌿",
  "International Relations": "🌍",
  "Government Schemes & Policies": "📜",
  "Judiciary & Legal": "⚖️",
  "Appointments & Resignations": "👤",
}; 
  const t = translations[language];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => {
              onCategorySelect(null);
              onHome();
            }}
            className="cursor-pointer"
          >
            <span className="text-xl md:text-2xl font-bold text-orange-400">
              SAMACHAR
            </span>
            <span className="text-xl md:text-2xl font-bold text-white">
              .AI
            </span>

            <p className="text-[10px] md:text-xs text-gray-400">
              AI-Powered Current Affairs
            </p>
          </div>

          {/* LOGIN */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
                {t.login}
              </button>
            </SignInButton>
          </SignedOut>

          {/* HAMBURGER */}
          <SignedIn>
            <button
              onClick={() => setMenuOpen(true)}
              className="text-3xl text-white"
            >
              ☰
            </button>
          </SignedIn>
        </div>
          
        {/* SEARCH BAR */}
        <div className="mt-4">
          <input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search news..."
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </nav>
      <div className="flex items-center gap-2">
  <button
    onClick={() => setLanguage("en")}
    className={`px-3 py-1 rounded-lg text-sm ${
      language === "en"
        ? "bg-orange-500 text-white"
        : "bg-gray-700 text-gray-300"
    }`}
  >
    EN
  </button>

  <button
    onClick={() => setLanguage("hi")}
    className={`px-3 py-1 rounded-lg text-sm ${
      language === "hi"
        ? "bg-orange-500 text-white"
        : "bg-gray-700 text-gray-300"
    }`}
  >
    हिन्दी
  </button>
</div>
      {/* OVERLAY */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* DRAWER */}
          {/* <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto"> */}
          <div
  className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto
  transform transition-transform duration-300 ease-in-out
  ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
>

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-orange-500 to-orange-400 text-white">
  <div>
    <h2 className="font-bold text-lg">SAMACHAR.AI</h2>
    <p className="text-xs opacity-80">
      Current Affairs Dashboard
    </p>
  </div>

  <button
    onClick={() => setMenuOpen(false)}
    className="text-2xl"
  >
    ✕
  </button>
</div>

            <div className="p-4 space-y-2">

              {/* ALL NEWS */}
              <button
                onClick={() => {
                  onCategorySelect(null);
                  onHome();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-orange-50 font-medium"
              >
                📄 {t.allNews}
              </button>

              {/* CATEGORIES */}
              <div className="border-t my-3"></div>

              <h3 className="font-semibold text-gray-700 px-3">
                {t.categories}
              </h3>
          

              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    onCategorySelect(cat.name);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    selectedCategory === cat.name
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {categoryIcons[cat.name] || "📌"}{" "}
{language === "hi"
  ? categoryHindi[cat.name] || cat.name
  : cat.name}
                </button>
              ))}

              <div className="border-t my-3"></div>

              {/* DAILY QUIZ */}
              <button
                onClick={() => {
                  onQuiz();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
              >
                {t.dailyQuiz}
              </button>

              {/* WEEKLY DIGEST */}
              <button
                onClick={() => {
                  onDigest();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
              >
                {t.weeklyDigest}
              </button>

              {/* PROFILE */}
              <button
                onClick={() => {
                  onProfile();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
              >
                {t.profile}
              </button>

              <div className="border-t my-3"></div>

              {/* CLERK USER */}
              {/* ACCOUNT */}
<div className="border-t my-3"></div>

<div className="px-3 py-2">
  <p className="text-xs uppercase text-gray-400 mb-2">
    {t.account}
  </p>

  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
    <span className="text-sm font-medium text-gray-700">
      Signed In
    </span>

    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox:
            "w-10 h-10 ring-2 ring-orange-200 hover:ring-orange-400 transition"
        }
      }}
    />
  </div>
</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}