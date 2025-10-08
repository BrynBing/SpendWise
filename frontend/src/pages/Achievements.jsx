import React from "react";
// 保留现有的React Icons导入
import { FaTrophy, FaCheck, FaCalendarCheck, FaRibbon, FaBullseye, FaStar, FaMedal, FaCrown, FaAward, FaGem, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

export default function Achievements() {
  // 成就数据，使用已知可用的图标
  const achievements = [
    {
      id: 1,
      icon: <FaCalendarCheck size={36} weight="fill" className="text-white" />,
      title: "1 Month Streak",
      description: "Logged in for 30 consecutive days",
      completedDate: "2023-08-15",
      unlocked: true,
    },
    {
      id: 2,
      icon: <FaShieldAlt size={36} weight="fill" className="text-white" />,
      title: "Successfully accomplished 1 goal",
      description: "Set and achieved your first financial goal",
      completedDate: "2023-07-22",
      unlocked: true,
    },
    {
      id: 3,
      icon: <FaTrophy className="text-white" />,
      title: "First transaction record added",
      description: "Started tracking your expenses",
      completedDate: "2023-07-10",
      unlocked: true,
    },
    {
      id: 4,
      icon: <FaRibbon className="text-white" />,
      title: "6 Months Streak",
      description: "Logged in for 180 consecutive days",
      completedDate: "2024-01-15",
      unlocked: true,
    },
    {
      id: 5,
      icon: <FaBullseye className="text-white" />,
      title: "Successfully accomplished all the goals from the month",
      description: "Achieved all your monthly financial goals",
      completedDate: "2023-09-30",
      unlocked: true,
    },
    {
      id: 6,
      icon: <FaStar className="text-white" />,
      title: "Successful login for 3 days",
      description: "Used the app for 3 consecutive days",
      completedDate: "2023-07-13",
      unlocked: true,
    },
    {
      id: 7,
      icon: <FaCheck className="text-white" />,
      title: "Set 3 financial goals",
      description: "Created multiple financial targets to achieve",
      completedDate: "2023-08-05",
      unlocked: true,
    },
    {
      id: 8,
      icon: <FaMedal className="text-white" />,
      title: "Achieved savings target",
      description: "Reached your savings goal for the first time",
      completedDate: "2023-09-10",
      unlocked: true,
    },
    {
      id: 9,
      icon: <FaCrown className="text-white" />,
      title: "Finance Master",
      description: "Complete all basic financial tracking achievements",
      completedDate: null,
      unlocked: false,
    }
  ];

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 添加一个渐变背景函数，为每个成就提供独特的背景色
  const getGradientBackground = (id) => {
    const gradients = [
      "bg-gradient-to-tr from-blue-600 to-purple-600",
      "bg-gradient-to-tr from-green-500 to-teal-400",
      "bg-gradient-to-tr from-yellow-400 to-orange-500",
      "bg-gradient-to-tr from-red-500 to-pink-500",
      "bg-gradient-to-tr from-purple-600 to-indigo-600",
      "bg-gradient-to-tr from-pink-500 to-rose-500",
      "bg-gradient-to-tr from-teal-400 to-cyan-500",
      "bg-gradient-to-tr from-amber-400 to-yellow-500",
      "bg-gradient-to-tr from-gray-700 to-gray-900",
    ];
    return gradients[(id - 1) % gradients.length];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
          Progress
        </span>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your financial milestones and celebrate your progress
        </p>
      </div>

      {/* Progress Overview Card */}
      <div className="mb-8 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {achievements.filter(a => a.unlocked).length} <span className="text-gray-500 dark:text-gray-400 text-lg font-normal">of {achievements.length}</span>
            </p>
          </div>
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <FaTrophy className="text-3xl text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}% Complete
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`group rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md ${
              achievement.unlocked 
                ? 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-100' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Achievement Icon */}
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl ${
                  achievement.unlocked 
                    ? getGradientBackground(achievement.id) 
                    : 'bg-gray-300 dark:bg-gray-700'
                } flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                  {React.cloneElement(achievement.icon, { 
                    className: achievement.unlocked ? "text-white text-2xl" : "text-gray-500 dark:text-gray-600 text-2xl" 
                  })}
                </div>
              </div>
              
              {/* Achievement Content */}
              <div className="flex-grow min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.completedDate && (
                  <div className="flex items-center gap-2 mt-2">
                    <FaCheckCircle className="text-green-500 dark:text-green-400 text-sm" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Achieved on {formatDate(achievement.completedDate)}
                    </p>
                  </div>
                )}
                {!achievement.unlocked && (
                  <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-2">
                    🔒 Locked
                  </p>
                )}
              </div>

              {/* Badge for unlocked achievements */}
              {achievement.unlocked && (
                <div className="flex-shrink-0">
                  {achievement.id % 3 === 0 ? (
                    <FaGem className="text-yellow-500 dark:text-yellow-400 text-2xl" />
                  ) : (
                    <FaAward className="text-yellow-500 dark:text-yellow-400 text-2xl" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
