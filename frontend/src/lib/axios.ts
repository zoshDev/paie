// src/lib/axios.ts
import axios from 'axios';

export  const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // utile si tu utilises des cookies (refresh_token)
});

