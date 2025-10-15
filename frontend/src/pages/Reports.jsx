import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import {
  FaShoppingCart,
  FaTshirt,
  FaSubway,
  FaCoffee,
  FaUtensils,
  FaGamepad,
  FaLightbulb,
} from "react-icons/fa";
import { expenseRecordService } from "../services/api";

// 类别图标映射
const categoryIcons = {
  Food: <FaUtensils />,
  Shopping: <FaShoppingCart />,
  Transport: <FaSubway />,
  Entertainment: <FaGamepad />,
  Utilities: <FaLightbulb />,
  // 添加更多类别和对应的图标
};

// 类别颜色映射
const categoryColors = {
  Food: "#FF6384",
  Shopping: "#36A2EB",
  Transport: "#FFCE56",
  Entertainment: "#4BC0C0",
  Utilities: "#9966FF",
  // 添加更多类别和对应的颜色
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 获取当前年份和周数
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // 计算当前周数 (1-52)
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  const currentWeek = getWeekNumber(currentDate);
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  // 生成年份选项 (当前年份往前5年)
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - i);
  }

  // 生成周数选项 (1-52)
  const weekOptions = [];
  for (let i = 1; i <= 52; i++) {
    weekOptions.push(i);
  }

  // 获取周报表数据
  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      setError(null);
      // 将 recordService 改为 expenseRecordService
      const response = await expenseRecordService.getWeeklyReport(selectedYear, selectedWeek);
      
      // 过滤掉totalAmount为0的类别
      const filteredData = response.data.filter(item => item.totalAmount > 0);
      setReportData(filteredData);
    } catch (err) {
      console.error("Error fetching weekly report:", err);
      setError("Failed to load report data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, [selectedYear, selectedWeek]);

  // 为图表转换数据格式
  const chartData = reportData.map(item => ({
    name: item.categoryName,
    amount: item.totalAmount,
    fill: categoryColors[item.categoryName] || "#8884d8", // 使用类别颜色或默认颜色
  }));

  // 获取所有可能的类别，即使当前周没有支出
  const allCategories = ["Food", "Shopping", "Transport", "Entertainment", "Utilities"];
  
  // 创建用于卡片显示的数据，包括所有类别（没有支出的显示为0）
  const categoryCards = allCategories.map(category => {
    const found = reportData.find(item => item.categoryName === category);
    return {
      name: category,
      amount: found ? found.totalAmount : 0,
      icon: categoryIcons[category] || <FaShoppingCart />,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-indigo-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Insights</span>
        <h1 className="text-3xl font-semibold text-gray-900">Weekly Reports</h1>
        <p className="text-gray-500">
          Understand your spending patterns for the selected week.
        </p>
      </div>

      {/* 选择器部分 */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Week:</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {weekOptions.map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchWeeklyReport}
          className="ml-auto rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-700"
        >
          Refresh Report
        </button>
      </div>

      {/* 加载和错误状态 */}
      {loading && (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="my-8 rounded-lg bg-red-50 p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* 图表部分 */}
      {!loading && !error && (
        <>
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Weekly Spending by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#6366F1" stroke="#4F46E5" />}
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 类别卡片 */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Spending Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {categoryCards.map((category) => (
                <div
                  key={category.name}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      {category.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        SPENT
                      </p>
                    </div>
                  </div>
                  <p className="mt-auto text-xl font-bold text-gray-900">
                    {formatCurrency(category.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
