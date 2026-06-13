

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

export default function Navbar({
  onSearch,
  onQuiz,
  onDigest,
  onHome,
  onProfile,
  categories = [],
  selectedCategory,
  onCategorySelect,
}) {
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
                Login
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

      {/* OVERLAY */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* DRAWER */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg text-gray-800">
                Menu
              </h2>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-600"
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
                📰 All News
              </button>

              {/* CATEGORIES */}
              <div className="border-t my-3"></div>

              <h3 className="font-semibold text-gray-700 px-3">
                Categories
              </h3>

              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    onCategorySelect(cat.name);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedCategory === cat.name
                      ? 'bg-orange-100 text-orange-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
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
                🧠 Daily Quiz
              </button>

              {/* WEEKLY DIGEST */}
              <button
                onClick={() => {
                  onDigest();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
              >
                📋 Weekly Digest
              </button>

              {/* PROFILE */}
              <button
                onClick={() => {
                  onProfile();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100"
              >
                👤 My Profile
              </button>

              <div className="border-t my-3"></div>

              {/* CLERK USER */}
              <div className="px-3 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}