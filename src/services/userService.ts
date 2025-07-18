import API from './api';

export const updateAvatar = (formData: FormData) =>
  API.put('/users/updateAvatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateCoverImage = (formData: FormData) =>
  API.put('/users/updateCoverImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateProfile = (data: { fullName: string; phone: string; address: string; description: string }) =>
  API.put('/users/updateProfile', data);

export const getUserById = (userId: string) =>
  API.get(`/users/getUserById/${userId}`);

export const getAllUsers = () =>
  API.get('/users/getAllUsers');

export const getAllAccounts = () =>
  API.get('/accounts/all');

export const getAllProAccounts = () =>
  API.get('/accounts/pro/all');

export const getProRevenueStats = () =>
  API.get('/stripe/pro-revenue-stats'); 


