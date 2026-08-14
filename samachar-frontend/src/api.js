

import axios from 'axios';

export const BASE_URL = 'https://samachar-api.onrender.com';

export const getRecent       = ()            => axios.get(`${BASE_URL}/api/news/today`);
export const getToday        = ()            => axios.get(`${BASE_URL}/api/news/today`);
export const getCategory     = (c)           => axios.get(`${BASE_URL}/api/news/category/${c}`);
export const getArticle      = (id)          => axios.get(`${BASE_URL}/api/news/${id}`);
export const getCategories   = ()            => axios.get(`${BASE_URL}/api/categories`);
export const getStats        = ()            => axios.get(`${BASE_URL}/api/stats`);
export const searchNews      = (q)           => axios.get(`${BASE_URL}/api/news/search/query?q=${q}`);
export const getQuiz         = ()            => axios.get(`${BASE_URL}/api/quiz/today`);
export const getWeeklyDigest = ()            => axios.get(`${BASE_URL}/api/digest/weekly`);
export const getProfile      = (clerkUserId) => axios.get(`${BASE_URL}/api/profile/${clerkUserId}`);
export const submitQuiz = (data) => {
  return axios.post("/api/quiz/submit", data);
};
