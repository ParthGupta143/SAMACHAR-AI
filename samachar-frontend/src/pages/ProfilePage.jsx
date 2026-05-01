import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { getProfile } from '../api';
import axios from "axios";
export default function ProfilePage({ onBack }) {
  const BASE_URL = "https://samachar-api.onrender.com";

  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then(r => {
        setProfile(r.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
  axios.get(`${BASE_URL}/api/leaderboard`)
    .then(res => setUsers(res.data))
    .catch(() => {});
}, []);

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Loading profile...</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Back */}
      <button onClick={onBack} className="text-orange-500 text-sm hover:underline mb-6 block">
        ← Back to News
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-5">
        <img
          src={user?.imageUrl}
          alt="avatar"
          className="w-16 h-16 rounded-full border-2 border-orange-300"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mt-1 inline-block">
            SAMACHAR.AI Member
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">
            {profile?.total_attempts ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Quizzes Taken</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-500">
            {profile?.avg_score ?? 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg Score</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-500">
            {profile?.best_score ?? 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Best Score</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
    <p className="text-3xl font-bold text-purple-500">
      {profile?.streak ?? 0}
    </p>
    <p className="text-xs text-gray-500 mt-1">Current Streak 🔥</p>
  </div>

</div>
      

      {/* Quiz History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Quiz History</h3>

        {profile?.history?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No quizzes attempted yet. Take a quiz to see your progress!
          </p>
        ) : (
          <div className="space-y-3">
            {profile?.history?.map((attempt, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Quiz #{profile.history.length - i}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(attempt.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-500">
                    {attempt.score}/{attempt.total}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${attempt.percentage >= 70 ? 'bg-green-100 text-green-600' :
                      attempt.percentage >= 40 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'}`}>
                    {attempt.percentage}%
                  </span>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
{/* Leaderboard */}
<div className="bg-white rounded-2xl border p-6 mt-6">
  <h3 className="font-bold mb-4">🏆 Leaderboard</h3>

  {users.length === 0 ? (
    <p>No leaderboard data yet</p>
  ) : (
    users.map((u, i) => (
      <div key={i} className="flex justify-between py-2">
        <span>#{i+1} {u.user_id}</span>
        <span>{u.avg_score}%</span>
      </div>
    ))
  )}
</div>
    </div>
  );
}