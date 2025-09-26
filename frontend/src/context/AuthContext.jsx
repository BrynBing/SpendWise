import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 验证用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录方法
  const login = async (identifier, password) => {
    try {
      // 1. 发送登录请求
      const loginResponse = await authService.login(identifier, password);
      
      // 2. 登录成功后，立即获取用户信息
      // 有些API在登录响应中返回用户信息，有些则需要额外请求
      let userData;
      
      if (loginResponse.data && loginResponse.data.user) {
        userData = loginResponse.data.user;
      } else {
        // 如果登录响应中没有用户数据，则单独获取
        const userResponse = await userService.getCurrentUser();
        userData = userResponse.data;
      }
      
      // 3. 更新状态
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log("Login successful, user data:", userData);
      
      return loginResponse;
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      const response = await authService.logout();
      
      // 确保状态被清除
      setUser(null);
      setIsAuthenticated(false);
      
      console.log("Logout successful");
      
      return response;
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
      throw error;
    }
  };

  // 提供一个刷新用户信息的方法
  const refreshUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}