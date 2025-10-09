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

export const securityQuestionService = {
  getAllQuestions: () => {
    return api.get("/api/security-questions/all");
  },

  saveAnswer: (username, questionId, answer) => {
    return api.post("/api/security-questions/save", {
      username,
      questionId,
      answer,
    });
  },
};

export const passwordResetService = {
  requestSecurityQuestion: (identifier) => {
    return api.post("/api/reset-password/request", { identifier });
  },

  resetPassword: (identifier, questionId, answer, newPassword) => {
    return api.post("/api/reset-password/confirm", {
      identifier,
      questionId,
      answer,
      newPassword,
    });
  },
};

// Expense Records API
export const expenseService = {
  // Get all expense records for current user
  getRecords: () => {
    return api.get("/api/records");
  },

  // Create a new expense record
  createRecord: (recordData) => {
    return api.post("/api/records", recordData);
  },

  // Update an expense record
  updateRecord: (id, recordData) => {
    return api.put(`/api/records/${id}`, recordData);
  },

  // Delete an expense record
  deleteRecord: (id) => {
    return api.delete(`/api/records/${id}`);
  },

  // Get weekly report
  getWeeklyReport: (year, week) => {
    return api.get("/api/records/reports/weekly", {
      params: { year, week },
    });
  },

  // Get monthly report
  getMonthlyReport: (year, month) => {
    return api.get("/api/records/reports/monthly", {
      params: { year, month },
    });
  },

  // Get yearly report
  getYearlyReport: (year) => {
    return api.get("/api/records/reports/yearly", {
      params: { year },
    });
  },
};

// Spending Goals API
export const goalService = {
  // Get all active spending goals for current user
  getActiveGoals: () => {
    return api.get("/api/goals");
  },

  // Create a new spending goal
  createGoal: (goalData) => {
    return api.post("/api/goals", goalData);
  },

  // Update an existing goal
  updateGoal: (goalId, goalData) => {
    return api.put(`/api/goals/${goalId}`, goalData);
  },

  // Delete a goal
  deleteGoal: (goalId) => {
    return api.delete(`/api/goals/${goalId}`);
  },
};

export default api;
