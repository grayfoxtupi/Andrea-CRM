import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // ajuste conforme necessário
});

export default api;
