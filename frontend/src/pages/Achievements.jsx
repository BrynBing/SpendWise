import React from "react";
import { FaTrophy, FaCheck, FaCalendarCheck, FaRibbon, FaBullseye, FaStar, FaMedal, FaCrown, FaAward } from "react-icons/fa";

export default function Achievements() {
  // 成就数据，包括图标、标题、完成日期和是否已解锁
  const achievements = [
    {
      id: 1,
      icon: <FaCalendarCheck className="text-white" />,
      title: "1 Month Streak",
      description: "Logged in for 30 consecutive days",
      completedDate: "2023-08-15",
      unlocked: true,
    },
    {
      id: 2,
      icon: <FaCheck className="text-white" />,
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-gray-600 mt-2">Track your financial milestones and progress</p>
      </div>

      <div className="space-y-6">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`flex items-center p-4 border-b ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="flex-shrink-0 mr-6">
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center">
                {React.cloneElement(achievement.icon, { className: "text-white text-3xl" })}
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
                <FaAward className="text-yellow-500 text-3xl" />
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
