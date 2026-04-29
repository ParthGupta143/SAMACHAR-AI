// import { useState, useEffect } from 'react';
// import { getQuiz } from '../api';

// export default function QuizPage({ onBack }) {
//   const [questions, setQuestions] = useState([]);
//   const [current,   setCurrent]   = useState(0);
//   const [selected,  setSelected]  = useState(null);
//   const [score,     setScore]     = useState(0);
//   const [finished,  setFinished]  = useState(false);
//   const [answered,  setAnswered]  = useState(false);
//   const [loading,   setLoading]   = useState(true);

//   useEffect(() => {
//     getQuiz().then(r => {
//       setQuestions(r.data?.questions || []);
//       setLoading(false);
//     });
//   }, []);

//   const handleSelect = (option) => {
//     if (answered) return;
//     setSelected(option);
//     setAnswered(true);
//     if (option === questions[current].correct) {
//       setScore(s => s + 1);
//     }
//   };

//   const handleNext = () => {
//     if (current + 1 >= questions.length) {
//       setFinished(true);
//     } else {
//       setCurrent(c => c + 1);
//       setSelected(null);
//       setAnswered(false);
//     }
//   };

//   if (loading) return (
//     <div className="text-center py-20 text-gray-400">Loading quiz...</div>
//   );

//   if (questions.length === 0) return (
//     <div className="text-center py-20">
//       <p className="text-gray-500 mb-4">No quiz available for today yet.</p>
//       <button onClick={onBack} className="text-orange-500 hover:underline">
//         ← Back to News
//       </button>
//     </div>
//   );

//   if (finished) return (
//     <div className="max-w-2xl mx-auto px-6 py-16 text-center">
//       <div className="text-6xl mb-4">🎯</div>
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
//       <p className="text-gray-500 mb-6">Based on today's current affairs</p>

//       <div className="bg-orange-50 rounded-2xl p-8 mb-8">
//         <p className="text-5xl font-bold text-orange-500 mb-1">
//           {score}/{questions.length}
//         </p>
//         <p className="text-gray-600">
//           {score === questions.length ? "Perfect score! 🏆" :
//            score >= questions.length * 0.7 ? "Great job! 👏" :
//            score >= questions.length * 0.4 ? "Keep practicing! 📚" :
//            "Read the news daily! 🗞️"}
//         </p>
//       </div>

//       <div className="flex gap-3 justify-center">
//         <button
//           onClick={() => {
//             setCurrent(0); setScore(0);
//             setSelected(null); setAnswered(false);
//             setFinished(false);
//           }}
//           className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
//         >
//           Retry
//         </button>
//         <button
//           onClick={onBack}
//           className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
//         >
//           Back to News
//         </button>
//       </div>
//     </div>
//   );

//   const q = questions[current];
//   const options = ["A", "B", "C", "D"];

//   const getOptionStyle = (opt) => {
//     if (!answered) return "border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer";
//     if (opt === q.correct) return "border-green-400 bg-green-50";
//     if (opt === selected && opt !== q.correct) return "border-red-400 bg-red-50";
//     return "border-gray-200 opacity-50";
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-6 py-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <button onClick={onBack} className="text-orange-500 text-sm hover:underline">
//           ← Back to News
//         </button>
//         <span className="text-sm text-gray-400">
//           {current + 1} / {questions.length}
//         </span>
//       </div>

//       {/* Progress bar */}
//       <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
//         <div
//           className="bg-orange-400 h-2 rounded-full transition-all duration-300"
//           style={{ width: `${((current + 1) / questions.length) * 100}%` }}
//         />
//       </div>

//       {/* Category tag */}
//       <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//         {q.category}
//       </span>

//       {/* Question */}
//       <h2 className="text-xl font-bold text-gray-900 mt-3 mb-6 leading-snug">
//         {q.question}
//       </h2>

//       {/* Options */}
//       <div className="space-y-3 mb-6">
//         {options.map(opt => (
//           <div
//             key={opt}
//             onClick={() => handleSelect(opt)}
//             className={`border-2 rounded-xl p-4 flex gap-3 items-start transition-all ${getOptionStyle(opt)}`}
//           >
//             <span className={`font-bold text-sm w-6 h-6 rounded-full flex items-center 
//               justify-center shrink-0
//               ${answered && opt === q.correct ? 'bg-green-400 text-white' :
//                 answered && opt === selected && opt !== q.correct ? 'bg-red-400 text-white' :
//                 'bg-gray-100 text-gray-600'}`}>
//               {opt}
//             </span>
//             <span className="text-gray-800 text-sm">{q.options[opt]}</span>
//           </div>
//         ))}
//       </div>

//       {/* Explanation */}
//       {answered && (
//         <div className={`rounded-xl p-4 mb-6 text-sm
//           ${selected === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//           <p className="font-semibold mb-1">
//             {selected === q.correct ? '✅ Correct!' : `❌ Correct answer: ${q.correct}`}
//           </p>
//           <p className="text-gray-700">{q.explanation}</p>
//         </div>
//       )}

//       {/* Next button */}
//       {answered && (
//         <button
//           onClick={handleNext}
//           className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
//         >
//           {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
//         </button>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
// import { getQuiz } from '../api';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
// import { getQuiz, BASE_URL } from '../api';
import { BASE_URL } from '../api';
// const BASE = 'https://samachar-api.onrender.com';
export const getProfile = (clerkUserId) =>
  axios.get(`${BASE_URL}/api/profile/${clerkUserId}`);
export default function QuizPage({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [score,     setScore]     = useState(0);
  const [finished,  setFinished]  = useState(false);
  const [answered,  setAnswered]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [fade, setFade] = useState(true);

  const { user, isSignedIn } = useUser(); // ← Clerk

  // useEffect(() => {
  //   getQuiz().then(r => {
  //     setQuestions(r.data?.questions || []);
  //     setLoading(false);
  //   });
  // }, []);
//   const fetchQuiz = async () => {
//   setLoading(true);
//   try {
//     const res = await axios.get(`${BASE_URL}/api/quiz?t=${Date.now()}`);
//     setQuestions(res.data?.questions || []);
//   } catch (err) {
//     console.error("Quiz fetch error:", err);
//   }
//   setLoading(false);
// };
const fetchQuiz = async () => {
  setFade(false); // fade out
  setLoading(true);

  try {
    const res = await axios.get(`${BASE_URL}/api/quiz?t=${Date.now()}`);
    
    setTimeout(() => {
      setQuestions(res.data?.questions || []);
      setFade(true); // fade in
    }, 200);

  } catch (err) {
    console.error("Quiz fetch error:", err);
  }

  setLoading(false);
};

useEffect(() => {
  fetchQuiz();
}, []);

  // Quiz finish hone pe auto-save
  useEffect(() => {
    if (finished && isSignedIn && !submitted) {
      axios.post(`${BASE_URL}/api/quiz/submit`, {
        clerk_user_id: user.id,
        score: score,
        total: questions.length
      }).then(() => setSubmitted(true))
        .catch(err => console.error("Submit error:", err));
    }
  },[finished, isSignedIn, submitted, score, questions.length, user?.id]);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === questions[current].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };
const handleNewQuiz = async () => {
  setLoading(true);

  try {
    // backend pe fresh quiz generate
    await axios.post(`${BASE_URL}/api/admin/generate-quiz`);

    // new quiz fetch
    await fetchQuiz();

    // reset state
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setFinished(false);
    setSubmitted(false);

  } catch (err) {
    console.error("New quiz error:", err);
  }

  setLoading(false);
};

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Loading quiz...</div>
  );

  if (questions.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">No quiz available for today yet.</p>
      <button onClick={onBack} className="text-orange-500 hover:underline">← Back to News</button>
    </div>
  );

  if (finished) return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-4">🎯</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
      <p className="text-gray-500 mb-6">Based on today's current affairs</p>

      <div className="bg-orange-50 rounded-2xl p-8 mb-4">
        <p className="text-5xl font-bold text-orange-500 mb-1">
          {score}/{questions.length}
        </p>
        <p className="text-gray-600">
          {score === questions.length ? "Perfect score! 🏆" :
           score >= questions.length * 0.7 ? "Great job! 👏" :
           score >= questions.length * 0.4 ? "Keep practicing! 📚" :
           "Read the news daily! 🗞️"}
        </p>
      </div>

      {/* Save status */}
      {isSignedIn && (
        <p className="text-sm text-gray-400 mb-6">
          {submitted ? "✅ Score saved to your profile" : "Saving..."}
        </p>
      )}
      {!isSignedIn && (
        <p className="text-sm text-orange-400 mb-6">
          💡 Login to save your quiz progress
        </p>
      )}

      <div className="flex gap-3 justify-center">
        <button
  onClick={handleNewQuiz}
          className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
        >
          New Quiz
        </button>
        <button
          onClick={onBack}
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
        >
          Back to News
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  const options = ["A", "B", "C", "D"];

  const getOptionStyle = (opt) => {
    if (!answered) return "border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer";
    if (opt === q.correct) return "border-green-400 bg-green-50";
    if (opt === selected && opt !== q.correct) return "border-red-400 bg-red-50";
    return "border-gray-200 opacity-50";
  };

  return (
   /* Top bar */
    // <div className="max-w-2xl mx-auto px-6 py-8">
    <div className={`max-w-2xl mx-auto px-6 py-8 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-orange-500 text-sm hover:underline">← Back to News</button>
        <span className="text-sm text-gray-400">{current + 1} / {questions.length}</span>
      </div>
       {/* ✅ NEW QUIZ BUTTON (ADD THIS HERE) */}
      {/* <div className="flex justify-end mb-4">
  <button
    onClick={handleNewQuiz}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
  >
    New Quiz
  </button>
</div> */}

<div className="flex justify-end mb-4">
  <button
    onClick={handleNewQuiz}
    disabled={loading}
    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition
      ${loading 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    {loading ? (
      <>
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        Generating...
      </>
    ) : (
      <>🔄 New Quiz</>
    )}
  </button>
</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-orange-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{q.category}</span>
      <h2 className="text-xl font-bold text-gray-900 mt-3 mb-6 leading-snug">{q.question}</h2>

      <div className="space-y-3 mb-6">
        {options.map(opt => (
          <div
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`border-2 rounded-xl p-4 flex gap-3 items-start transition-all ${getOptionStyle(opt)}`}
          >
            <span className={`font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center shrink-0
              ${answered && opt === q.correct ? 'bg-green-400 text-white' :
                answered && opt === selected && opt !== q.correct ? 'bg-red-400 text-white' :
                'bg-gray-100 text-gray-600'}`}>
              {opt}
            </span>
            <span className="text-gray-800 text-sm">{q.options[opt]}</span>
          </div>
        ))}
      </div>

      {answered && (
        <div className={`rounded-xl p-4 mb-6 text-sm
          ${selected === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-semibold mb-1">
            {selected === q.correct ? '✅ Correct!' : `❌ Correct answer: ${q.correct}`}
          </p>
          <p className="text-gray-700">{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
        >
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}