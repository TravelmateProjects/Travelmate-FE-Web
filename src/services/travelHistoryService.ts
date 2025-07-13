import API from './api';

export const getAllTravelHistories = (params?: any) =>
  API.get('/travelHistory/all', { params }); 