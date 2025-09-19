import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Placeholder data for future backend integration
const balanceData = {
  total: 12345.60,
  percentChange: 0.8,
  monthlySavings: 123.50
};

// Chart data for different time ranges
const chartData = {
  Day: [
    { name: '12am', save: 500, spend: 600 },
    { name: '4am', save: 800, spend: 700 },
    { name: '8am', save: 1200, spend: 1000 },
    { name: '12pm', save: 1500, spend: 1200 },
    { name: '4pm', save: 1800, spend: 1500 },
    { name: '8pm', save: 2100, spend: 2000 },
    { name: '11pm', save: 2400, spend: 2200 },
  ],
  Week: [
    { name: 'Mon', save: 1000, spend: 800 },
    { name: 'Tue', save: 1500, spend: 1300 },
    { name: 'Wed', save: 2000, spend: 1600 },
    { name: 'Thu', save: 2200, spend: 2000 },
    { name: 'Fri', save: 2700, spend: 2400 },
    { name: 'Sat', save: 3200, spend: 2800 },
    { name: 'Sun', save: 3500, spend: 3200 },
  ],
  Month: [
    { name: '1', save: 1000, spend: 800 },
    { name: '5', save: 1400, spend: 1200 },
    { name: '10', save: 2000, spend: 1700 },
    { name: '15', save: 2600, spend: 2200 },
    { name: '20', save: 3000, spend: 2600 },
    { name: '25', save: 3400, spend: 3100 },
    { name: '30', save: 3800, spend: 3500 },
  ],
  Year: [
    { name: 'JAN', save: 1000, spend: 800 },
    { name: 'FEB', save: 1500, spend: 1300 },
    { name: 'MAR', save: 2000, spend: 1700 },
    { name: 'APR', save: 2300, spend: 2000 },
    { name: 'MAY', save: 2800, spend: 2400 },
    { name: 'JUN', save: 3200, spend: 2800 },
    { name: 'JUL', save: 3600, spend: 3200 },
    { name: 'AUG', save: 4000, spend: 3600 },
    { name: 'SEP', save: 4500, spend: 4000 },
    { name: 'OCT', save: 4900, spend: 4400 },
    { name: 'NOV', save: 5300, spend: 4800 },
    { name: 'DEC', save: 5800, spend: 5200 },
  ],
};

const recentTransactionsData = [
  { id: 1, name: "Grocery", amount: -200, type: "expense" },
  { id: 2, name: "Uber", amount: -50, type: "expense" },
  { id: 3, name: "Pay Check", amount: 500, type: "income" },
  { id: 4, name: "Grocery", amount: -200, type: "expense" },
  { id: 5, name: "Bank Transfer", amount: 300, type: "income" },
  { id: 6, name: "Money Transfer", amount: -80, type: "expense" },
];

const goalsData = [
  { id: 1, name: "Phone", amount: 1500, progress: 60 },
  { id: 2, name: "Fitness watch", amount: 500, progress: 75 },
  { id: 3, name: "Laptop", amount: 2000, progress: 40 },
  { id: 4, name: "Emergency fund", amount: 2000, progress: 85 },
  { id: 5, name: "University Tuition", amount: 3000, progress: 30 },
  { id: 6, name: "Monthly savings", amount: 2000, progress: 50 },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Year");
  const userName = "John"; // This would come from user authentication

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200 text-xs">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-green-500">{`Save: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-red-500">{`Spend: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome, {userName}!</p>
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Balance info */}
        <div className="space-y-6">
          {/* Total Balance Card */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center text-green-500 font-medium mb-1">
              <span className="text-xs">↑ {balanceData.percentChange}%</span>
            </div>
            <p className="text-sm text-gray-500">Total Balance</p>
            <h3 className="text-2xl font-bold">{formatCurrency(balanceData.total)}</h3>
          </div>

          {/* Monthly Save Card */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center text-green-500 font-medium mb-1">
              <span className="text-xs">↑ {balanceData.percentChange}%</span>
            </div>
            <p className="text-sm text-gray-500">Monthly Save</p>
            <h3 className="text-2xl font-bold">{formatCurrency(balanceData.monthlySavings)}</h3>
          </div>

          {/* Chart Area */}
          <div className="bg-gray-100 p-4 rounded-lg">
            {/* Time range selector */}
            <div className="flex gap-4 mb-4 text-sm">
              {["Day", "Week", "Month", "Year"].map(range => (
                <button 
                  key={range}
                  className={`${timeRange === range ? 'font-medium text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Chart implementation with Recharts */}
            <div className="h-64 bg-white rounded border border-gray-200 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData[timeRange]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    domain={['dataMin - 100', 'dataMax + 100']}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="save" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center mt-2 text-xs gap-4">
              <div className="flex items-center">
                <span className="inline-block w-4 h-[2px] bg-green-500 mr-1"></span>
                <span className="text-gray-500">SAVE</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-[2px] bg-red-500 mr-1"></span>
                <span className="text-gray-500">SPEND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column - Recent Transactions */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactionsData.map(transaction => (
              <div key={transaction.id} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center">
                  <span>{transaction.name}</span>
                  <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    {transaction.amount > 0 ? `+${formatCurrency(transaction.amount)}` : formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Goals */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="mb-6">
            <h2 className="text-sm text-gray-500 mb-2">Progress Bar</h2>
            <progress className="progress w-full" value="70" max="100"></progress>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Current Goals</h2>
          <div className="space-y-4">
            {goalsData.map(goal => (
              <div key={goal.id} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span>{goal.name}</span>
                  <span className="font-medium">{formatCurrency(goal.amount)}</span>
                </div>
                <progress 
                  className="progress progress-primary w-full h-1" 
                  value={goal.progress} 
                  max="100"
                ></progress>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="flex justify-center mt-8">
        <button className="btn btn-neutral gap-2 px-8">
          <FaPlus /> Transaction
        </button>
      </div>
    </div>
  );
}
