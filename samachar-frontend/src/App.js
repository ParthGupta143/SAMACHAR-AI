

// import { useState } from 'react';
import { useState, useEffect } from 'react';
import { getCategories } from './api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import QuizPage from './pages/QuizPage';
import WeeklyDigest from './pages/WeeklyDigest';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [language, setLanguage] = useState(
  localStorage.getItem("lang") || "en"
);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showQuiz,       setShowQuiz]       = useState(false);
  const [showDigest,     setShowDigest]     = useState(false);
  const [showProfile,    setShowProfile]    = useState(false); // ← new
  const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
useEffect(() => {
  localStorage.setItem("lang", language);
}, [language]);
useEffect(() => {
  getCategories()
    .then(r => setCategories(r.data.categories || []))
    .catch(console.error);
}, []);
  // const [language, setLanguage] = useState('en'); // 'en' or 'hi'

  
  const goHome = () => {
    setCurrentArticle(null);
    setShowQuiz(false);
    setShowDigest(false);
    setShowProfile(false); // ← new
    setSearchQuery('');
    setSelectedCategory(null);// reset point
  };

  const goProfile = () => {
    setShowProfile(true);
    setShowQuiz(false);
    setShowDigest(false);
    setCurrentArticle(null);
  };

  return (
    <div className="font-sans">
     <Navbar
  onSearch={setSearchQuery}
  onQuiz={() => {
    setShowQuiz(true);
    setShowDigest(false);
    setShowProfile(false);
  }}
  onDigest={() => {
    setShowDigest(true);
    setShowQuiz(false);
    setShowProfile(false);
  }}
  onHome={goHome}
  onProfile={goProfile}
  categories={categories}
  selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
  language={language}
  setLanguage={setLanguage}
/>

      {showProfile
        ? <ProfilePage onBack={goHome} />
        : showQuiz
          ? <QuizPage onBack={goHome} />
          : showDigest
            ? <WeeklyDigest
        onBack={goHome} onArticleClick={setCurrentArticle}/>
            : currentArticle
              ? <ArticleDetail articleId={currentArticle} onBack={goHome} />
              :<Home
  onArticleClick={setCurrentArticle}
  searchQuery={searchQuery}
  selectedCategory={selectedCategory}
  language={language}
/>
      }
    </div>
  );
}