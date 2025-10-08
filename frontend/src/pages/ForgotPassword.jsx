import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState("email");

  // For security questions
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [username, setUsername] = useState("");

  // Mock security questions (in a real app, these would come from the backend)
  const securityQuestions = [
    "What was the name of your first pet?",
    "What was the name of the street you grew up on?",
    "What is your mother's maiden name?",
    "In what city were you born?",
    "What was the make of your first car?",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (recoveryMethod === "email") {
        console.log("Reset password email sent to:", email);
        setSubmitted(true);
      } else {
        console.log("Security question verification attempt:", {
          username,
          question: securityQuestion,
          answer: securityAnswer,
        });
        // In a real app, you'd verify the answer and then either show a password reset form
        // or redirect to a password reset page
        setSubmitted(true);
      }
      setLoading(false);
    }, 1500);
  };

  const toggleRecoveryMethod = () => {
    setRecoveryMethod(recoveryMethod === "email" ? "security" : "email");
    // Reset form state when switching methods
    setSubmitted(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
        {/* Logo Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 mb-4">
            <span className="text-white font-bold text-2xl">SW</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Account Recovery</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {recoveryMethod === "email"
              ? "We'll send you a link to reset your password"
              : "Answer your security question to recover access"}
          </p>
        </div>

        {!submitted ? (
          <>
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 p-1">
              <button
                className={`flex-1 py-2 px-4 text-center rounded-xl text-sm font-medium transition-all ${
                  recoveryMethod === "email" 
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setRecoveryMethod("email")}
                type="button"
              >
                Email Recovery
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center rounded-xl text-sm font-medium transition-all ${
                  recoveryMethod === "security" 
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => setRecoveryMethod("security")}
                type="button"
              >
                Security Questions
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {recoveryMethod === "email" ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="securityQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Security Question
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaQuestionCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <select
                        id="securityQuestion"
                        name="securityQuestion"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors appearance-none"
                        value={securityQuestion}
                        onChange={(e) => setSecurityQuestion(e.target.value)}
                      >
                        <option value="">Select your security question</option>
                        {securityQuestions.map((question, index) => (
                          <option key={index} value={question}>
                            {question}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer
                    </label>
                    <input
                      id="securityAnswer"
                      name="securityAnswer"
                      type="text"
                      required
                      className="w-full px-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="Enter your answer"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-indigo-600 dark:bg-indigo-500 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer disabled:opacity-50 font-semibold text-sm uppercase tracking-wider"
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
                    {recoveryMethod === "email" ? "Sending..." : "Verifying..."}
                  </span>
                ) : recoveryMethod === "email" ? (
                  "Send Reset Link"
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FaCheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {recoveryMethod === "email"
                ? "Check your email"
                : "Verification Successful"}
            </h2>
            {recoveryMethod === "email" ? (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to:{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If you don't see it, please check your spam folder.
                </p>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Your identity has been verified. You can now reset your password.
              </p>
            )}
            <div className="pt-4 space-y-2">
              {recoveryMethod === "email" && (
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none block w-full font-medium"
                >
                  Use a different email address
                </button>
              )}
              <button
                onClick={toggleRecoveryMethod}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none block w-full font-medium"
              >
                {recoveryMethod === "email"
                  ? "Try security questions instead"
                  : "Try email recovery instead"}
              </button>
              {recoveryMethod === "security" && (
                <button
                  className="w-full px-4 py-3 mt-4 text-white bg-indigo-600 dark:bg-indigo-500 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors font-semibold text-sm uppercase tracking-wider"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
