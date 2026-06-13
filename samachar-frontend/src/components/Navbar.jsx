// export default function Navbar({ onSearch }) {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
//       <div>
//         <span className="text-2xl font-bold text-orange-400">SAMACHAR</span>
//         <span className="text-2xl font-bold text-white">.AI</span>
//         <p className="text-xs text-gray-400">AI-Powered Current Affairs</p>
//       </div>
//       <input
//         onChange={e => onSearch(e.target.value)}
//         placeholder="Search news..."
//         className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
//       />
//     </nav>
//   );
// }

// export default function Navbar({ onSearch, onQuiz }) {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
//       <div>
//         <span className="text-2xl font-bold text-orange-400">SAMACHAR</span>
//         <span className="text-2xl font-bold text-white">.AI</span>
//         <p className="text-xs text-gray-400">AI-Powered Current Affairs</p>
//       </div>
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onQuiz}
//           className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition"
//         >
//           🧠 Daily Quiz
//         </button>
//         <input
//           onChange={e => onSearch(e.target.value)}
//           placeholder="Search news..."
//           className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
//         />
//       </div>
//     </nav>
//   );
// }
// import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

// export default function Navbar({ onSearch, onQuiz, onDigest, onHome }) {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
//       <div onClick={onHome} className="cursor-pointer">
//         <span className="text-2xl font-bold text-orange-400">SAMACHAR</span>
//         <span className="text-2xl font-bold text-white">.AI</span>
//         <p className="text-xs text-gray-400">AI-Powered Current Affairs</p>
//       </div>
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onDigest}
//           className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
//         >
//           📋 Weekly Digest
//         </button>
//         <button
//           onClick={onQuiz}
//           className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition"
//         >
//           🧠 Daily Quiz
//         </button>
//         <input
//           onChange={e => onSearch(e.target.value)}
//           placeholder="Search news..."
//           className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
//         />
//       </div>
//       <SignedOut>
//   <SignInButton mode="modal">
//     <button className="btn-login">Login</button>
//   </SignInButton>
// </SignedOut>

// <SignedIn>
//   <UserButton afterSignOutUrl="/" />
// </SignedIn>
//     </nav>
//   );
// }


// import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

// export default function Navbar({ onSearch, onQuiz, onDigest, onHome, onProfile }) {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
//       <div onClick={onHome} className="cursor-pointer">
//         <span className="text-2xl font-bold text-orange-400">SAMACHAR</span>
//         <span className="text-2xl font-bold text-white">.AI</span>
//         <p className="text-xs text-gray-400">AI-Powered Current Affairs</p>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           onClick={onDigest}
//           className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
//         >
//           📋 Weekly Digest
//         </button>
//         <button
//           onClick={onQuiz}
//           className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition"
//         >
//           🧠 Daily Quiz
//         </button>
//         <input
//           onChange={e => onSearch(e.target.value)}
//           placeholder="Search news..."
//           className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
//         />

//         <SignedOut>
//           <SignInButton mode="modal">
//             <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
//               Login
//             </button>
//           </SignInButton>
//         </SignedOut>

//         <SignedIn>
//           <button
//             onClick={onProfile}
//             className="text-sm text-gray-300 hover:text-orange-400 font-medium transition"
//           >
//             My Profile
//           </button>
//           <UserButton afterSignOutUrl="/" />
//         </SignedIn>

//       </div>
//     </nav>
//   );
// }

//Mobile resposnive

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';

// export default function Navbar({ onSearch, onQuiz, onDigest, onHome, onProfile }) {
export default function Navbar({ onSearch, onQuiz, onDigest, onHome, onProfile}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50">
      
      {/* 🔥 TOP ROW */}
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <div onClick={onHome} className="cursor-pointer">
          <span className="text-xl md:text-2xl font-bold text-orange-400">SAMACHAR</span>
          <span className="text-xl md:text-2xl font-bold text-white">.AI</span>
          <p className="text-[10px] md:text-xs text-gray-400">
            AI-Powered Current Affairs
          </p>
        </div>

        {/* 🔥 Hamburger (mobile only) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🔥 MENU SECTION */}
      <div
        className={`flex-col md:flex md:flex-row md:items-center gap-3 mt-3 md:mt-0 ${
          menuOpen ? 'flex' : 'hidden'
        }`}
      >
    
        {/* Buttons */}
        <button
          onClick={onDigest}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition w-full md:w-auto"
        >
          📋 Weekly Digest
        </button>

        <button
          onClick={onQuiz}
          className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition w-full md:w-auto"
        >
          🧠 Daily Quiz
        </button>

        {/* Search */}
        <input
          onChange={e => onSearch(e.target.value)}
         placeholder="Search news..."
          className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full md:w-64 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition w-full md:w-auto">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            
            <button
              onClick={onProfile}
              className="text-sm text-gray-300 hover:text-orange-400 font-medium transition"
            >
              My Profile
            </button>

            <UserButton afterSignOutUrl="/" />

          </div>
        </SignedIn>

      </div>
    </nav>
  );
}