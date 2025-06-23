import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const updateUser = async (id: number, updatedData: any) => {
  const response = await axios.put(`${API_BASE}/users/${id}`, updatedData);
  return response.data;
};
