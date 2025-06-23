import api from './api';

export const getClientTasks = async () => {
  const response = await api.get('/api/client-tasks');
  return response.data;
};

export const createClientTask = async (task: any) => {
  const response = await api.post('/api/client-tasks', task);
  return response.data;
};

export const updateClientTask = async (id: number, task: any) => {
  const response = await api.put(`/api/client-tasks/${id}`, task);
  return response.data;
};

export const deleteClientTask = async (id: number) => {
  const response = await api.delete(`/api/client-tasks/${id}`);
  return response.data;
};
