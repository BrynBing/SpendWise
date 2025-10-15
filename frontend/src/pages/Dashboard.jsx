import React, { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Placeholder data for future backend integration
const balanceData = {
  total: 12345.6,
  percentChange: 0.8,
  monthlyBudget: 123.5,
};

// Chart data for different time ranges
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
    { name: "JAN", save: 1000, spend: 800 },
    { name: "FEB", save: 1500, spend: 1300 },
    { name: "MAR", save: 2000, spend: 1700 },
    { name: "APR", save: 2300, spend: 2000 },
    { name: "MAY", save: 2800, spend: 2400 },
    { name: "JUN", save: 3200, spend: 2800 },
    { name: "JUL", save: 3600, spend: 3200 },
    { name: "AUG", save: 4000, spend: 3600 },
    { name: "SEP", save: 4500, spend: 4000 },
    { name: "OCT", save: 4900, spend: 4400 },
    { name: "NOV", save: 5300, spend: 4800 },
    { name: "DEC", save: 5800, spend: 5200 },
  ],
};

const recentTransactionsData = [
  { id: 1, name: "Grocery", amount: -200, type: "Expense" },
  { id: 2, name: "Uber", amount: -50, type: "Expense" },
  { id: 4, name: "Grocery", amount: -200, type: "Expense" },
  { id: 6, name: "Money Transfer", amount: -80, type: "Expense" },
];

const goalsData = [
  { id: 1, name: "Phone", amount: 1500, progress: 60 },
  { id: 2, name: "Fitness watch", amount: 500, progress: 75 },
  { id: 3, name: "Laptop", amount: 2000, progress: 40 },
  { id: 4, name: "Emergency fund", amount: 2000, progress: 85 },
  { id: 5, name: "University Tuition", amount: 3000, progress: 30 },
  { id: 6, name: "Monthly budget", amount: 2000, progress: 50 },
];

const timeRanges = ["Day", "Week", "Month", "Year"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Year");
  const userName = "John"; // Placeholder until auth integration

  const transactionTotals = useMemo(() => {
    return recentTransactionsData.reduce(
      (acc, transaction) => {
        acc.expense += Math.abs(transaction.amount);
        return acc;
      },
      { expense: 0 }
    );
  }, []);

  const averageGoalProgress = useMemo(() => {
    if (goalsData.length === 0) {
      return 0;
    }

    const total = goalsData.reduce((acc, goal) => acc + goal.progress, 0);
    return Math.round(total / goalsData.length);
  }, []);

  // Chart tooltip matches new card styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs shadow-md">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-emerald-500">Save: {formatCurrency(payload[0].value)}</p>
          <p className="text-rose-500">Spend: {formatCurrency(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Overview</span>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, {userName}. Here's a look at your money today.</p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Total Balance</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(balanceData.total)}
            </p>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-500">
              ↑ {balanceData.percentChange}%
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Monthly Budget</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(balanceData.monthlyBudget)}
            </p>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-500">
              On Track
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Total Expense</p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-semibold text-rose-500">
              {formatCurrency(transactionTotals.expense)}
            </p>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
              This Period
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm lg:col-span-2 transition-colors duration-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Cash Flow</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Budget vs Spending</h2>
            </div>
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    timeRange === range
                      ? "bg-gray-900 dark:bg-gray-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-72 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 transition-colors duration-200">
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

          <div className="mt-4 flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span className="inline-block h-[2px] w-6 bg-emerald-500" />
              <span className="tracking-[0.3em]">Save</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span className="inline-block h-[2px] w-6 bg-rose-500" />
              <span className="tracking-[0.3em]">Spend</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Activity</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <ul className="mt-6 divide-y divide-gray-100 dark:divide-gray-700">
            {recentTransactionsData.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    {transaction.type}
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {transaction.name}
                  </p>
                </div>
                <span
                  className={`text-base font-semibold ${
                    transaction.amount >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {transaction.amount >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm lg:col-span-2 transition-colors duration-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Goals</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Goals</h2>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Average Progress</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{averageGoalProgress}%</p>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {goalsData.map((goal) => (
              <li key={goal.id} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="uppercase tracking-[0.2em]">{goal.name}</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(goal.amount)}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gray-900 dark:bg-gray-600"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                  {goal.progress}% completed
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-200">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Quick Action</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Add Transaction</h2>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Jump straight into logging a new expense without leaving your
              overview.
            </p>
          </div>
          <div className="mt-8">
            <button className="w-full rounded-full bg-gray-900 dark:bg-gray-700 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700 dark:hover:bg-gray-600">
              <span className="inline-flex items-center justify-center gap-2">
                <FaPlus /> Transaction
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
