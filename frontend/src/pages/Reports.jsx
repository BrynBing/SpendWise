import React, { useState } from "react";
import { FaDownload, FaShoppingCart, FaTshirt, FaSubway, FaCoffee, FaBook, FaSuitcase } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Placeholder data for the chart
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
    { name: 'JAN', save: 1200, spend: 1500 },
    { name: 'FEB', save: 1000, spend: 1300 },
    { name: 'MAR', save: 800, spend: 1100 },
    { name: 'APR', save: 1500, spend: 2000 },
    { name: 'MAY', save: 3200, spend: 2000 },
    { name: 'JUN', save: 2700, spend: 1500 },
    { name: 'JUL', save: 3500, spend: 2900 },
    { name: 'AUG', save: 4200, spend: 3800 },
    { name: 'SEP', save: 3800, spend: 3000 },
    { name: 'OCT', save: 4500, spend: 3500 },
    { name: 'NOV', save: 4800, spend: 4200 },
    { name: 'DEC', save: 5000, spend: 4800 },
  ],
};

// Top categories data
const topCategoriesData = [
  { 
    id: 1, 
    name: "Clothes", 
    icon: <FaTshirt />, 
    amount: 400, 
    change: 4, 
    isIncrease: false 
  },
  { 
    id: 2, 
    name: "Grocery Shopping", 
    icon: <FaShoppingCart />, 
    amount: 300, 
    change: 3, 
    isIncrease: true 
  },
  { 
    id: 3, 
    name: "Public Transport", 
    icon: <FaSubway />, 
    amount: 200, 
    change: 2, 
    isIncrease: false 
  },
  { 
    id: 4, 
    name: "Coffee", 
    icon: <FaCoffee />, 
    amount: 100, 
    change: 1, 
    isIncrease: true 
  },
  { 
    id: 5, 
    name: "Books", 
    icon: <FaBook />, 
    amount: 200, 
    change: 2, 
    isIncrease: false 
  },
  { 
    id: 6, 
    name: "Travel", 
    icon: <FaSuitcase />, 
    amount: 100, 
    change: 1, 
    isIncrease: true 
  },
];

export default function Reports() {
  const [timeRange, setTimeRange] = useState("Year");
  const currentMonth = "August";

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      </div>

      {/* Main content area - Changed the grid layout here */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - Chart - Now spans 3 of 5 columns */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 p-6 rounded-lg h-full">
            {/* Time range selector */}
            <div className="flex justify-between mb-6 text-sm">
              {["Day", "Week", "Month", "Year"].map(range => (
                <button 
                  key={range}
                  className={`px-4 py-1 rounded ${timeRange === range 
                    ? 'text-gray-800 font-medium' 
                    : 'text-gray-500'}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center mb-4 text-xs gap-8">
              <div className="flex items-center">
                <span className="inline-block w-4 h-[2px] bg-green-500 mr-1"></span>
                <span className="text-gray-500">SAVE</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-[2px] bg-red-500 mr-1"></span>
                <span className="text-gray-500">SPEND</span>
              </div>
            </div>
            
            {/* Chart implementation - Increased height for better visibility */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData[timeRange]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 10,
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
                  <Tooltip 
                    formatter={(value) => [`$${value}`, undefined]}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #f0f0f0',
                      borderRadius: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="save" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 5 }}
                    name="Savings"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 5 }}
                    name="Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Download button */}
            <div className="flex justify-end mt-4">
              <button className="p-2 rounded-md hover:bg-gray-200">
                <FaDownload className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Right column - Categories - Now spans 2 of 5 columns */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            {currentMonth}'s Top Categories
          </h2>
          
          {/* Updated to always show 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            {topCategoriesData.map(category => (
              <div key={category.id} className="bg-gray-100 p-6 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-200 p-3 rounded-full mb-2">
                    {category.icon}
                  </div>
                  <h3 className="text-gray-700 font-medium mb-1 text-center">{category.name}</h3>
                  <p className="text-lg font-semibold mb-1">{formatCurrency(category.amount)}</p>
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    category.isIncrease ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'
                  }`}>
                    {category.isIncrease ? 
                      <span>↑ {category.change}%</span> : 
                      <span>↓ {category.change}%</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
