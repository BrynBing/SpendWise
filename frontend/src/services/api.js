import axios from 'axios';

// 创建axios实例 - 不再使用完整的基础URL
const api = axios.create({
  // 移除baseURL，因为我们使用相对路径
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 认证相关API
export const authService = {
  login: (identifier, password) => {
    return api.post('/api/auth/login', { identifier, password });
  },
  logout: () => {
    return api.post('/api/auth/logout');
  }
};

export default api;