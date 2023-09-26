import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // 替换为您的API的基础URL
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;