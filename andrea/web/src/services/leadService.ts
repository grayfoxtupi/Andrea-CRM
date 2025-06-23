import axios from 'axios';


const api2 = axios.create({
  baseURL: 'http://localhost:9090', 
  headers: {
    'Content-Type':'application/json'
  }
});



// const API_BASE = 'http://localhost:9090'; // dai vcs ajustam ai se n for isso

export const createLead = async (leadData: any) => {
  const response = await api2.post('/api/leads', leadData);
  return response.data;
};

export const getLeads = async () => {
  const response = await api2.get('/api/leads');
  return response.data;
};
