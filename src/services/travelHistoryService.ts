import API from './api';

export const getAllTravelHistories = (params?: any) =>
  API.get('/travelHistory/all', { params });

export const getTravelHistoryByIdAdmin = (id: string) =>
  API.get(`/travelHistory/admin/${id}`);