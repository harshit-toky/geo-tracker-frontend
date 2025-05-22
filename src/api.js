// src/api.js
import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000', // replace with your actual base URL
//   withCredentials: true, // optional: if you're using sessions/cookies
// });

const api = axios.create({
  baseURL: "https://geo-tracker-backend.onrender.com", // replace with your actual base URL
  withCredentials: true, // optional: if you're using sessions/cookies
});

export default api;
