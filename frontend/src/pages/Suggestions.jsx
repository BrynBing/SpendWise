import React, { useState, useEffect } from "react";
import { FaLightbulb, FaChartPie, FaCalendarAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { aiSuggestionsService } from "../services/api";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Generate month options (current month and previous 11 months)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Load suggestions on component mount and when month changes
  useEffect(() => {
    if (!selectedMonth) {
      setSelectedMonth(getCurrentMonth());
    } else {
      fetchSuggestions(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchSuggestions = async (month) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiSuggestionsService.generateSuggestions(month);
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError(err.response?.data?.message || "Failed to load AI suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const formatCurrency = (value, currency = "AUD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + "%";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaLightbulb className="text-3xl text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">AI Financial Suggestions</h1>
          </div>
          
          {/* Month Selector */}
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-500" />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-gray-600">
          Get personalized financial insights and recommendations based on your spending patterns.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="text-5xl text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Analyzing your spending patterns...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <FaExclamationCircle className="text-2xl text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Suggestions</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* No Data State */}
      {suggestions?.noData && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <FaExclamationCircle className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Not Enough Data</h3>
          <p className="text-gray-600">
            {suggestions.message || "There isn't enough transaction data for this month to generate suggestions."}
          </p>
          <p className="text-gray-500 mt-2">Try selecting a different month or add more expenses.</p>
        </div>
      )}

      {/* Suggestions Content */}
      {suggestions && !suggestions.noData && !loading && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-3">Monthly Overview</h2>
            <p className="text-lg leading-relaxed">{suggestions.summary}</p>
            {suggestions.totalSpending !== undefined && (
              <div className="mt-4 pt-4 border-t border-blue-400">
                <p className="text-sm opacity-90">Total Spending</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(suggestions.totalSpending, suggestions.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          {suggestions.totalsByCategory && suggestions.totalsByCategory.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="text-xl text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">Spending by Category</h2>
              </div>
              <div className="space-y-3">
                {suggestions.totalsByCategory.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{category.catName}</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(category.amount, suggestions.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: formatPercentage(category.pct) }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium min-w-[50px] text-right">
                        {formatPercentage(category.pct)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {suggestions.bullets && suggestions.bullets.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <FaLightbulb className="text-xl text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">AI Recommendations</h2>
              </div>
              <div className="space-y-4">
                {suggestions.bullets.map((bullet, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 border-l-4 border-blue-500"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {index + 1}. {bullet.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{bullet.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
            <p>
              Suggestions generated for <strong>{selectedMonth}</strong>
              {suggestions.language && ` • Language: ${suggestions.language}`}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              These suggestions are AI-generated based on your spending patterns. Always consider your personal financial situation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
