import api from './api';

export const createLeadTask = async (data: any) => {
  return api.post('/api/lead-tasks', data).then(res => res.data);
};

export const getLeadTasks = async () => {
  return api.get('/api/lead-tasks').then(res => res.data);
};

export const updateLeadTask = async (id: number, data: any) => {
  return api.put(`/api/lead-tasks/${id}`, data).then(res => res.data);
};

export const deleteLeadTask = async (id: number) => {
  return api.delete(`/api/lead-tasks/${id}`).then(res => res.data);
};
