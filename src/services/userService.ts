import API from './api';

export const updateAvatar = (formData: FormData) =>
  API.put('/users/updateAvatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateCoverImage = (formData: FormData) =>
  API.put('/users/updateCoverImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateProfile = (data: { fullName: string; phone: string; address: string; description: string }) =>
  API.put('/users/updateProfile', data);

export const getUserById = (userId: string) =>
  API.get(`/users/getUserById/${userId}`);


export const getAllUsers = (filters?: { searchTerm?: string; status?: string }) => {
  let query = '';
  if (filters) {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.status) params.append('status', filters.status);
    query = '?' + params.toString();
  }
  return API.get('/users/getAllUsers' + query);
};

export const lockUser = (userId: string) =>
  API.put(`/users/lockUser/${userId}`);

export const unlockUser = (userId: string) =>
  API.put(`/users/unlockUser/${userId}`);

export const getAllAccounts = () =>
  API.get('/accounts/all');

export const getAllProAccounts = () =>
  API.get('/accounts/pro/all');

export const getProRevenueStats = () =>
  API.get('/stripe/pro-revenue-stats'); 

export const getAllUsersforstatistics = () =>
  API.get('/users/getAllUsersforstatistics');

