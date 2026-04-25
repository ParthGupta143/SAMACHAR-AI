// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import { useState } from 'react';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import ArticleDetail from './pages/ArticleDetail';

// export default function App() {
//   const [currentArticle, setCurrentArticle] = useState(null);
//   const [searchQuery,    setSearchQuery]    = useState('');

//   return (
//     <div className="font-sans">
//       <Navbar onSearch={setSearchQuery} />
//       {currentArticle
//         ? <ArticleDetail
//             articleId={currentArticle}
//             onBack={() => setCurrentArticle(null)}
//           />
//         : <Home
//             onArticleClick={setCurrentArticle}
//             searchQuery={searchQuery}
//           />
//       }
//     </div>
//   );
// }

// import { useState } from 'react';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import ArticleDetail from './pages/ArticleDetail';
// import QuizPage from './pages/QuizPage';

// export default function App() {
//   const [currentArticle, setCurrentArticle] = useState(null);
//   const [searchQuery,    setSearchQuery]    = useState('');
//   const [showQuiz,       setShowQuiz]       = useState(false);

//   return (
//     <div className="font-sans">
//       <Navbar onSearch={setSearchQuery} onQuiz={() => setShowQuiz(true)} />
//       {showQuiz
//         ? <QuizPage onBack={() => setShowQuiz(false)} />
//         : currentArticle
//           ? <ArticleDetail
//               articleId={currentArticle}
//               onBack={() => setCurrentArticle(null)}
//             />
//           : <Home
//               onArticleClick={setCurrentArticle}
//               searchQuery={searchQuery}
//             />
//       }
//     </div>
//   );
// }

import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import QuizPage from './pages/QuizPage';
import WeeklyDigest from './pages/WeeklyDigest';

export default function App() {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showQuiz,       setShowQuiz]       = useState(false);
  const [showDigest,     setShowDigest]     = useState(false);

  const goHome = () => {
    setCurrentArticle(null);
    setShowQuiz(false);
    setShowDigest(false);
    setSearchQuery('');
  };

  return (
    <div className="font-sans">
      <Navbar
        onSearch={setSearchQuery}
        onQuiz={() => { setShowQuiz(true); setShowDigest(false); }}
        onDigest={() => { setShowDigest(true); setShowQuiz(false); }}
        onHome={goHome}
      />
      {showQuiz
        ? <QuizPage onBack={goHome} />
        : showDigest
          ? <WeeklyDigest onBack={goHome} onArticleClick={setCurrentArticle} />
          : currentArticle
            ? <ArticleDetail articleId={currentArticle} onBack={goHome} />
            : <Home onArticleClick={setCurrentArticle} searchQuery={searchQuery} />
      }
    </div>
  );
}