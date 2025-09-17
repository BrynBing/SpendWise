import React from "react";

export default function Dashboard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
          <p className="text-gray-600">
            Your dashboard content will appear here...
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
          <p className="text-gray-600">
            Your dashboard content will appear here...
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Goals Progress</h2>
          <p className="text-gray-600">
            Your dashboard content will appear here...
          </p>
        </div>
      </div>
    </>
  );
}
