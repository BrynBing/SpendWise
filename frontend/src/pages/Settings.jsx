import React, { useState } from "react";
import { FaUser, FaBell, FaEye, FaMoon, FaDollarSign, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Setting</h1>
      </div>

      <div className="space-y-3">
        {/* Profile Section */}
        <Link to="/account">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer mb-3">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <FaUser className="text-gray-600 text-xl" />
              </div>
              <span className="ml-4 text-lg">Profile</span>
            </div>
            <FaChevronRight className="text-gray-400" />
          </div>
        </Link>

        {/* Notifications Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full">
              <FaBell className="text-gray-600 text-xl" />
            </div>
            <span className="ml-4 text-lg">Notifications</span>
          </div>
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>

        {/* Dyslexia Font Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full">
              <FaEye className="text-gray-600 text-xl" />
            </div>
            <span className="ml-4 text-lg">Dyslexia Font</span>
          </div>
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={dyslexiaFont}
            onChange={() => setDyslexiaFont(!dyslexiaFont)}
          />
        </div>

        {/* Dark Theme Toggle */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full">
              <FaMoon className="text-gray-600 text-xl" />
            </div>
            <span className="ml-4 text-lg">Dark Theme</span>
          </div>
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={darkTheme}
            onChange={() => setDarkTheme(!darkTheme)}
          />
        </div>

        {/* Currency Conversion */}
        <Link to="/currency-conversion">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <FaDollarSign className="text-gray-600 text-xl" />
              </div>
              <span className="ml-4 text-lg">Currency Conversion</span>
            </div>
            <FaChevronRight className="text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button 
          className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          onClick={() => console.log("Logging out...")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
