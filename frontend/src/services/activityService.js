import api from './api';

export const activityService = {
  getLeadActivities: (leadId) =>
    api.get(`/activity/lead/${leadId}`),

  getAllActivities: (page = 1, limit = 50) =>
    api.get(`/activity?page=${page}&limit=${limit}`),
};

export default activityService;
