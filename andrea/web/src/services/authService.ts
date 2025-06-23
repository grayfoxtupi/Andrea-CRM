import axios from 'axios';

const API_BASE = 'http://localhost:8080'; 
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE}/users`, userData);
  return response.data;
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE}/logins/login`, credentials);
  return response.data; 
};

export const fetchAllUsers = async () => {
  const response = await axios.get(`${API_BASE}/users`);
  return response.data;
};

export const fetchUserByEmail = async (email: string) => {
  const users = await fetchAllUsers();
  return users.find((u: any) => u.email === email);
};
