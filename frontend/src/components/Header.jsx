import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // 导入useAuth

export default function Header() {
  const { user, loading, logout } = useAuth(); // 使用AuthContext提供的状态和方法
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 切换下拉菜单状态
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout(); // 使用AuthContext提供的logout方法
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 获取用户头像或初始字母
  const getUserAvatar = () => {
    if (user?.profilePictureUrl) {
      return (
        <img 
          src={user.profilePictureUrl} 
          alt={user.username} 
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    } else {
      const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
      return (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
          {initial}
        </div>
      );
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl" to="/">SpendWise</Link>
      </div>
      
      <div className="navbar-center"></div>
      
      <div className="navbar-end">
        {loading ? (
          // 加载中显示一个骨架屏
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        ) : user ? (
          // 用户已登录，显示用户名和头像
          <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm">
            {/* 用户名显示在外面 */}
            <div className="text-right hidden md:block">
              <div className="text-xs text-gray-500">Signed in as</div>
              <div className="font-semibold text-sm">{user.username}</div>
            </div>
            
            {/* 头像和下拉菜单 */}
            <div className="dropdown dropdown-end relative">
              <button 
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle p-0"
                aria-label="User menu"
              >
                {getUserAvatar()}
              </button>
              
              {dropdownOpen && (
                <ul className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2 absolute right-0 z-10 border border-gray-200">
                  {/* 在移动端显示用户名 */}
                  <li className="menu-title px-4 py-2 text-sm font-medium text-gray-600 md:hidden">
                    <span>Signed in as</span>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                  </li>
                  <div className="divider my-1 md:hidden"></div>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaTachometerAlt className="text-gray-500" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="text-gray-500" />
                      Account Settings
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          // 用户未登录，显示登录和注册按钮
          <>
            <Link to="/login" className="mr-2">
              <button className="btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn">Sign up</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
