import React, { useState } from "react";
import {
  FaUser,
  FaBell,
  FaEye,
  FaMoon,
  FaDollarSign,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFont } from "../context/FontContext";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const { dyslexiaFont, setDyslexiaFont } = useFont();
  const [darkTheme, setDarkTheme] = useState(false);

  const preferenceToggles = [
    {
      id: "notifications",
      label: "Notifications",
      description: "Get reminders about bills, goals, and budget alerts.",
      icon: FaBell,
      value: notifications,
      onToggle: () => setNotifications((prev) => !prev),
    },
    {
      id: "dyslexiaFont",
      label: "Dyslexia-friendly Font",
      description: "Use typography that's easier to scan quickly.",
      icon: FaEye,
      value: dyslexiaFont,
      onToggle: () => setDyslexiaFont((prev) => !prev),
    },
    {
      id: "darkTheme",
      label: "Dark Theme",
      description: "Reduce glare and make SpendWise easier on the eyes.",
      icon: FaMoon,
      value: darkTheme,
      onToggle: () => setDarkTheme((prev) => !prev),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Profile</span>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Tune SpendWise to match your habits, accessibility needs, and account preferences.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Account</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-600">
                <FaUser />
              </span>
              <div>
                <p className="text-base font-semibold text-gray-900">Profile & Security</p>
                <p className="text-sm text-gray-500">Update your details, password, and security options.</p>
              </div>
            </div>
            <Link to="/account" className="text-gray-400 transition-colors hover:text-gray-600">
              <FaChevronRight size={18} />
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Preferences</p>
          <ul className="mt-4 divide-y divide-gray-100">
            {preferenceToggles.map((toggle) => (
              <li key={toggle.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-600">
                    <toggle.icon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{toggle.label}</p>
                    <p className="text-xs text-gray-500">{toggle.description}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-neutral"
                  checked={toggle.value}
                  onChange={toggle.onToggle}
                  aria-label={toggle.label}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Tools</p>
          <Link
            to="/currency-conversion"
            className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-600">
                <FaDollarSign />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Currency Conversion</p>
                <p className="text-xs text-gray-500">Calculate balances in the currencies you monitor.</p>
              </div>
            </div>
            <FaChevronRight className="text-gray-400" />
          </Link>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Session</p>
          <div className="mt-4 rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-500">
              Ready for a reset? You'll be signed out immediately and can log back in whenever you're ready.
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-rose-500 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-rose-600"
              onClick={() => console.log("Logging out...")}
            >
              Log Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
