import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // <— Ahora todas las llamadas a '/api/...'
  timeout: 10000,
});

export default api;