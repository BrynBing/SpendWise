import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SecurityQuestions() {
  const navigate = useNavigate();
  const questions = [
    "What was the name of your first pet?",
    "What was the name of the street you grew up on?",
    "What is your mother's maiden name?",
    "In what city were you born?",
    "What was the make of your first car?",
  ];

  const [q1, setQ1] = useState("");
  const [a1, setA1] = useState("");
  const [q2, setQ2] = useState("");
  const [a2, setA2] = useState("");
  const [q3, setQ3] = useState("");
  const [a3, setA3] = useState("");
  const [loading, setLoading] = useState(false);

  const available = (exclude = []) =>
    questions.filter((q) => !exclude.includes(q));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("Saved questions", { q1, a1, q2, a2, q3, a3 });
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Security Questions</h1>
          <p className="mt-2 text-gray-600">
            Add three questions only you know. These help recover your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div>
              <label htmlFor="q1" className="sr-only">Question 1</label>
              <select
                id="q1"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a question</option>
                {available([]).map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                required
                className="mt-3 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="q2" className="sr-only">Question 2</label>
              <select
                id="q2"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a question</option>
                {available([q1]).map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={a2}
                onChange={(e) => setA2(e.target.value)}
                required
                className="mt-3 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="q3" className="sr-only">Question 3</label>
              <select
                id="q3"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a question</option>
                {available([q1, q2]).map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={a3}
                onChange={(e) => setA3(e.target.value)}
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
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Want to do this later?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Skip to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
