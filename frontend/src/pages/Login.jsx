import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { authService } from "../services/api";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const navigate = useNavigate();

  const TOAST_ICON = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
  };

  const ToastIcon = toast.type ? TOAST_ICON[toast.type] : TOAST_ICON.info;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.login(identifier, password);
      
      // 登录成功，显示toast
      showToast(response.data.message || "Login successful.", "success");
      
      // 2秒后跳转到dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      // 登录失败，显示toast
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      showToast(errorMessage, "error");
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
      
      // 如果是成功消息，淡出后跳转
      if (type === "success") {
        navigate("/dashboard");
      }
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Login Here</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, you've been missed!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Email or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Signup here
            </Link>
          </p>
        </div>
      </div>
      
      {/* 成功/失败toast通知 */}
      {toast.show && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                  ? "alert-error"
                  : toast.type === "warning"
                    ? "alert-warning"
                    : "alert-info"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <ToastIcon className="text-lg" />
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
