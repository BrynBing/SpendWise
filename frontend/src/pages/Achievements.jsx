import React from "react";
// 保留现有的React Icons导入
import { FaTrophy, FaCheck, FaCalendarCheck, FaRibbon, FaBullseye, FaStar, FaMedal, FaCrown, FaAward, FaGem, FaShieldAlt } from "react-icons/fa";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-gray-600 mt-2">Track your financial milestones and progress</p>
      </div>

      <div className="space-y-8">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`flex items-center p-6 border rounded-xl shadow-sm transition-all hover:shadow-md ${achievement.unlocked ? 'opacity-100' : 'opacity-60'}`}
          >
            <div className="flex-shrink-0 mr-6">
              {/* 使用动态渐变背景和增大的图标尺寸 */}
              <div className={`w-24 h-24 rounded-full ${getGradientBackground(achievement.id)} flex items-center justify-center shadow-lg`}>
                {React.cloneElement(achievement.icon, { className: "text-white text-4xl" })}
              </div>
            </div>
            
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{achievement.title}</h2>
              <p className="text-gray-600">{achievement.description}</p>
              {achievement.unlocked && achievement.completedDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Achieved on {formatDate(achievement.completedDate)}
                </p>
              )}
              {!achievement.unlocked && (
                <p className="text-sm text-gray-500 mt-1">
                  Locked - Complete required tasks to unlock
                </p>
              )}
            </div>

            {achievement.unlocked && (
              <div className="flex-shrink-0 ml-4">
                {/* 替换不存在的 UilAward 和 AnimatedStar */}
                {achievement.id % 3 === 0 ? (
                  <FaGem className="text-yellow-500 text-4xl" />
                ) : (
                  <FaAward className="text-yellow-500 text-3xl" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="inline-block bg-gray-100 rounded-lg p-4">
          <p className="text-gray-700">
            <span className="font-bold">{achievements.filter(a => a.unlocked).length}</span> of {achievements.length} achievements unlocked
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
            <div 
              className="bg-gray-800 h-2.5 rounded-full" 
              style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
