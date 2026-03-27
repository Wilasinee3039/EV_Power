import api from './api';

export const leadService = {
  getAllLeads: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.product) params.append('product', filters.product);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    return api.get(`/leads?${params.toString()}`);
  },

  getLeadById: (id) =>
    api.get(`/leads/${id}`),

  createLead: (leadData) =>
    api.post('/leads', leadData),

  updateLead: (id, leadData) =>
    api.patch(`/leads/${id}`, leadData),

  deleteLead: (id) =>
    api.delete(`/leads/${id}`),

  getDashboardStats: () =>
    api.get('/dashboard/stats'),
};

export default leadService;
