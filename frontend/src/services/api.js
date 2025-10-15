import axios from "axios";

// 创建axios实例 - 不再使用完整的基础URL
const api = axios.create({
  // 移除baseURL，因为我们使用相对路径
  timeout: 10000,
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
  getCurrentUser: () => {
    return api.get("/api/auth/me");
  },
};

// register api
export const registerService = {
  register: (registerData) => {
    // registerData should contain: username, email, password, phoneNumber (optional), securityQuestion, securityAnswer
    return api.post("/api/register", registerData);
  },
};

// user profile api
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

// password related apis
export const passwordResetService = {
  // security questions for a given identifier (username or email)
  requestSecurityQuestion: (identifier) => {
    return api.post("/api/reset-password/request", { identifier });
  },

  // confirm password reset with security answer and new password
  confirmReset: (identifier, securityAnswer, newPassword) => {
    return api.post("/api/reset-password/confirm", {
      identifier,
      securityAnswer,
      newPassword,
    });
  },
};

// expense record apis
export const expenseRecordService = {
  getAllRecords: async () => {
    const response = await api.get("/api/records");
    return response.data;
  },

  searchRecords: async (params) => {
    // includes filtering, pagination, and sorting
    const response = await api.get("/api/records/search", { params });
    return response.data;
  },

  createRecord: async (recordData, frequency = null) => {
    // includes one-time and recurring records
    const params = frequency ? { frequency } : {};
    const response = await api.post("/api/records", recordData, { params });
    return response.data;
  },

  updateRecord: async (id, recordData, frequency = null) => {
    const params = frequency ? { frequency } : {};
    const response = await api.put(`/api/records/${id}`, recordData, { params });
    return response.data;
  },

  deleteRecord: async (id, cancelRecurring = false) => {
    const response = await api.delete(`/api/records/${id}`, {
      params: { cancelRecurring },
    });
    return response.data;
  },

  getWeeklyReport: (year, week) => {
    return api.get("/api/records/reports/weekly", {
      params: { year, week },
    });
  },

  getMonthlyReport: (year, month) => {
    return api.get("/api/records/reports/monthly", {
      params: { year, month },
    });
  },

  getYearlyReport: (year) => {
    return api.get("/api/records/reports/yearly", {
      params: { year },
    });
  },
};

// create goals api
export const goalsService = {
  // include list, create, update, delete goals
  listActiveGoals: () => {
    return api.get("/api/goals");
  },

  createGoal: (goalData) => {
    // include name, targetAmount, category, deadline
    return api.post("/api/goals", goalData);
  },
};

// ai suggestions api
export const aiSuggestionsService = {
  generateSuggestions: (month = null) => {
    // format of month: "YYYY-MM"
    const params = month ? { month } : {};
    return api.post("/api/suggestions/generate", null, { params });
  },
};

// security questions api
export const securityQuestionsService = {
  getAllQuestions: () => {
    return api.get("/api/security-questions");
  },
};

export default api;
