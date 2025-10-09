import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { securityQuestionService } from "../services/api";

export default function SecurityQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Get user info from navigation state or session storage
  const username =
    location.state?.username || sessionStorage.getItem("newUsername");

  // Load security questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await securityQuestionService.getAllQuestions();
        setQuestions(response.data);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load security questions. Please try again.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedQuestionId || !answer) {
      setError("Please select a question and provide an answer");
      return;
    }

    if (!username) {
      setError("Session expired. Please register again.");
      navigate("/signup");
      return;
    }

    setLoading(true);

    try {
      // Save security question answer using the dedicated endpoint
      await securityQuestionService.saveAnswer(
        username,
        parseInt(selectedQuestionId),
        answer
      );

      // Clear session storage
      sessionStorage.removeItem("newUsername");
      sessionStorage.removeItem("registrationEmail");

      // Navigate to login with success message
      navigate("/login", {
        state: {
          message: "Registration complete! Please login with your credentials.",
        },
      });
    } catch (err) {
      console.error("Failed to save security question:", err);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Failed to save security question. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    sessionStorage.removeItem("newUsername");
    sessionStorage.removeItem("registrationEmail");
    navigate("/login", {
      state: {
        message:
          "Registration complete! You can set up security questions later.",
      },
    });
  };

  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Set Up Security Question
          </h1>
          <p className="mt-2 text-gray-600">
            Choose a security question to help recover your account if needed.
          </p>
          {username && (
            <p className="mt-2 text-sm text-gray-500">
              Setting up for: <span className="font-semibold">{username}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select a Security Question
              </label>
              <select
                id="question"
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a question --</option>
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.questionText}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                placeholder="Type your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Make sure you remember this answer - you'll need it to recover
                your account.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Saving...
              </span>
            ) : (
              "Save and Continue"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
