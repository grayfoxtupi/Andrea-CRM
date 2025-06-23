import api from './api';

export const getClients = async () => {
  try {
    const response = await api.get('/api/clients');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const createClient = async (data: any) => {
  const response = await api.post('/api/clients', data);
  return response.data;
};

export const updateClient = async (id: number, data: any) => {
  const response = await api.put(`/api/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: number) => {
  const response = await api.delete(`/api/clients/${id}`);
  return response.data;
};
