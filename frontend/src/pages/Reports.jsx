import React, { cloneElement, useState } from "react";
import {
  FaDownload,
  FaShoppingCart,
  FaTshirt,
  FaSubway,
  FaCoffee,
  FaBook,
  FaSuitcase,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const timeRanges = ["Day", "Week", "Month", "Year"];

// Placeholder data for the chart
const chartData = {
  Day: [
    { name: "12am", save: 500, spend: 600 },
    { name: "4am", save: 800, spend: 700 },
    { name: "8am", save: 1200, spend: 1000 },
    { name: "12pm", save: 1500, spend: 1200 },
    { name: "4pm", save: 1800, spend: 1500 },
    { name: "8pm", save: 2100, spend: 2000 },
    { name: "11pm", save: 2400, spend: 2200 },
  ],
  Week: [
    { name: "Mon", save: 1000, spend: 800 },
    { name: "Tue", save: 1500, spend: 1300 },
    { name: "Wed", save: 2000, spend: 1600 },
    { name: "Thu", save: 2200, spend: 2000 },
    { name: "Fri", save: 2700, spend: 2400 },
    { name: "Sat", save: 3200, spend: 2800 },
    { name: "Sun", save: 3500, spend: 3200 },
  ],
  Month: [
    { name: "1", save: 1000, spend: 800 },
    { name: "5", save: 1400, spend: 1200 },
    { name: "10", save: 2000, spend: 1700 },
    { name: "15", save: 2600, spend: 2200 },
    { name: "20", save: 3000, spend: 2600 },
    { name: "25", save: 3400, spend: 3100 },
    { name: "30", save: 3800, spend: 3500 },
  ],
  Year: [
    { name: "JAN", save: 1200, spend: 1500 },
    { name: "FEB", save: 1000, spend: 1300 },
    { name: "MAR", save: 800, spend: 1100 },
    { name: "APR", save: 1500, spend: 2000 },
    { name: "MAY", save: 3200, spend: 2000 },
    { name: "JUN", save: 2700, spend: 1500 },
    { name: "JUL", save: 3500, spend: 2900 },
    { name: "AUG", save: 4200, spend: 3800 },
    { name: "SEP", save: 3800, spend: 3000 },
    { name: "OCT", save: 4500, spend: 3500 },
    { name: "NOV", save: 4800, spend: 4200 },
    { name: "DEC", save: 5000, spend: 4800 },
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
    isIncrease: false,
  },
  {
    id: 2,
    name: "Grocery Shopping",
    icon: <FaShoppingCart />,
    amount: 300,
    change: 3,
    isIncrease: true,
  },
  {
    id: 3,
    name: "Public Transport",
    icon: <FaSubway />,
    amount: 200,
    change: 2,
    isIncrease: false,
  },
  {
    id: 4,
    name: "Coffee",
    icon: <FaCoffee />,
    amount: 100,
    change: 1,
    isIncrease: true,
  },
  {
    id: 5,
    name: "Books",
    icon: <FaBook />,
    amount: 200,
    change: 2,
    isIncrease: false,
  },
  {
    id: 6,
    name: "Travel",
    icon: <FaSuitcase />,
    amount: 100,
    change: 1,
    isIncrease: true,
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const changeBadgeClass = (isIncrease) =>
  `inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
    isIncrease ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
  }`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-emerald-500">Save: {formatCurrency(payload[0].value)}</p>
        <p className="text-rose-500">Spend: {formatCurrency(payload[1].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [timeRange, setTimeRange] = useState("Year");
  const currentMonth = "August";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Insights</span>
        <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-500">
          Understand how your money moves over time and where it tends to go.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm lg:col-span-2 transition-colors duration-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Savings vs Spending</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Comparing performance across your selected timeframe.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                      timeRange === range
                        ? "bg-gray-900 dark:bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaDownload /> Export
              </button>
            </div>
          </div>

          <div className="mt-8 h-80 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 transition-colors duration-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData[timeRange]}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
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
                  domain={["dataMin - 100", "dataMax + 100"]}
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="inline-block h-[2px] w-6 bg-emerald-500" />
              <span className="tracking-[0.3em]">Save</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <span className="inline-block h-[2px] w-6 bg-rose-500 dark:bg-rose-400" />
              <span className="tracking-[0.3em]">Spend</span>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">
              {currentMonth} Snapshot
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 transition-colors duration-200">Categories</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Top Spending</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Your highest spending areas this {currentMonth.toLowerCase()}.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {topCategoriesData.map((category) => (
              <li
                key={category.id}
                className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col h-full min-h-[120px] transition-colors duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-lg text-gray-600 dark:text-gray-300 flex-shrink-0 mt-1 transition-colors duration-200">
                    {cloneElement(category.icon, { className: "w-4 h-4" })}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight transition-colors duration-200">
                      {category.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-200">
                      Spent
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {formatCurrency(category.amount)}
                  </p>
                  <span className={changeBadgeClass(category.isIncrease)}>
                    {category.isIncrease ? "↑" : "↓"} {category.change}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
