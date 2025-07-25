import API from './api';

const reportService = {
  getAllReports: () => API.get('/report'),
  deleteReport: (reportId: string) => API.delete(`/report/${reportId}`),
};

export default reportService;

