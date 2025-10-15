import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { securityQuestionsService, registerService } from "../services/api";

export default function SecurityQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state;

  // Mock data as fallback
  const mockQuestions = [
    { id: 1, questionText: "What was the name of your first pet?" },
    { id: 2, questionText: "What is your mother's maiden name?" },
    { id: 3, questionText: "What was the name of your elementary school?" },
    { id: 4, questionText: "What city were you born in?" },
    { id: 5, questionText: "What was your childhood nickname?" },
  ];

  const [questions, setQuestions] = useState(mockQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if no user data from signup
    if (!userData || !userData.username || !userData.email || !userData.password) {
      navigate("/signup");
      return;
    }

    // Try to fetch security questions from backend, but use mock data as fallback
    const fetchQuestions = async () => {
      setFetchingQuestions(true);
      try {
        const response = await securityQuestionsService.getAllQuestions();
        if (response.data && response.data.length > 0) {
          setQuestions(response.data);
        }
      } catch (err) {
        console.warn("Failed to fetch security questions from backend, using mock data:", err);
        // Keep using mock data - no error shown to user
      } finally {
        setFetchingQuestions(false);
      }
    };

    fetchQuestions();
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Prepare registration data
      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber || null,
        questionId: parseInt(selectedQuestionId),
        answer: answer,
      };

      // Call register API
      const response = await registerService.register(registerData);
      
      console.log("Registration successful:", response.data);
      
      // Navigate to login page on success
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading security questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Security Question</h1>
          <p className="mt-2 text-gray-600">
            Choose a security question to help recover your account if needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label htmlFor="securityQuestion" className="sr-only">Security Question</label>
              <select
                id="securityQuestion"
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a security question</option>
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.questionText}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                className="mt-3 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
