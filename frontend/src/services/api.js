import axios from "axios";

// 创建axios实例 - 不再使用完整的基础URL
const api = axios.create({
  // 移除baseURL，因为我们使用相对路径
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 认证相关API
export const authService = {
  login: (identifier, password) => {
    return api.post("/api/auth/login", { identifier, password });
  },
  logout: () => {
    return api.post("/api/auth/logout");
  },
  register: (username, email, password, phoneNumber, questionId, answer) => {
    return api.post("/api/register", {
      username,
      email,
      password,
      phoneNumber,
      questionId,
      answer,
    });
  },
};

// 用户相关API
export const userService = {
  // 获取当前用户信息 - 使用/api/auth/me路径
  getCurrentUser: () => {
    return api.get("/api/auth/me");
  },

  // 更新用户资料
  updateProfile: (userData) => {
    return api.put("/api/users/myself", userData);
  },

  // 上传头像 - 使用/api/users/myself/picture路径
  uploadAvatar: (formData) => {
    return api.post("/api/users/myself/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
