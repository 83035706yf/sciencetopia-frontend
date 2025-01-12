import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5085/api', // 替换为您的API的基础URL
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const pyApiClient = axios.create({
  baseURL: 'http://localhost:5086/api', // 替换为您的API的基础URL
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export { apiClient, pyApiClient }
