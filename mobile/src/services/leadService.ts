import api from './api';

export const createCompany = async (companyData: any) => {
  const response = await api.post('/api/companies', companyData);
  return response.data;
};

export const createLead = async (leadData: any) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

// export const updateLeadTask = async (taskId: number, leadTaskData: any) => {
//   const response = await api.put(`/api/lead-tasks/${taskId}`, leadTaskData);
//   return response.data;
// };

export const updateLeadTask = async (id: number, data: any) => {
  return api.put(`/api/lead-tasks/${id}`, data).then(res => res.data);
};

export const getLeads = async () => {
  const response = await api.get('/api/leads');
  return response.data;
};
