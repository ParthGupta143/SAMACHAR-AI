//Single place for all API calls
import axios from 'axios';

const BASE = 'https://samachar-api.onrender.com';  // your Render URL
export const getRecent = () => {
  return axios.get(`${BASE}/api/news/today`);
};
export const getToday     = ()   => axios.get(`${BASE}/api/news/today`);
export const getCategory  = (c)  => axios.get(`${BASE}/api/news/category/${c}`);
export const getArticle   = (id) => axios.get(`${BASE}/api/news/${id}`);
export const getCategories= ()   => axios.get(`${BASE}/api/categories`);
export const getStats     = ()   => axios.get(`${BASE}/api/stats`);
export const searchNews   = (q)  => axios.get(`${BASE}/api/news/search/query?q=${q}`);