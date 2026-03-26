import api from './api';

export const configService = {
  getAllConfigs: () => api.get('/configs'),
  updateConfig: (key, value, description) => api.put(`/configs/${key}`, null, { params: { value, description } })
};
