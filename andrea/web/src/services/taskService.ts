import axios from 'axios';

const API_BASE = 'http://localhost:8080/tarefas'; // ajuste conforme sua API

export const createTask = async (taskData: any) => {
  const response = await axios.post(`${API_BASE}`, taskData);
  return response.data;
};

export const getTasks = async () => {
  const response = await axios.get(`${API_BASE}`);
  return response.data;
};
