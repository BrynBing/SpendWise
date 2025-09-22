import React, { useRef, useState } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const INPUT_CLASSES =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-gray-400 focus:outline-none";

const LABEL_CLASSES =
  "text-xs font-semibold uppercase tracking-[0.25em] text-gray-400";

const TOAST_ICON = {
  success: FaCheckCircle,
  error: FaExclamationCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
};

export default function Account() {
  const [user, setUser] = useState({
    username: "John Doe",
    email: "johndoe@email.com",
    phone_number: "123456789",
    profile_picture_url: null,
  });
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setUser((prev) => ({ ...prev, profile_picture_url: imageUrl }));
    showToast("Profile image updated", "success");
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();

    if (!user.username.trim()) {
      showToast("Username cannot be empty", "error");
      return;
    }

    if (!user.email.trim()) {
      showToast("Email cannot be empty", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    console.log("Profile update data:", user);
    showToast("Profile updated successfully", "success");
  };

  const handleChangePassword = () => {
    setPasswordModal({
      show: true,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordModal((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwordModal.currentPassword) {
      showToast("Current password cannot be empty", "error");
      return;
    }

    if (!passwordModal.newPassword) {
      showToast("New password cannot be empty", "error");
      return;
    }

    if (passwordModal.newPassword !== passwordModal.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordModal.currentPassword !== "password123") {
      showToast("Current password is incorrect", "error");
      return;
    }

    if (passwordModal.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    console.log("Password change submitted");
    setPasswordModal({ show: false, currentPassword: "", newPassword: "", confirmPassword: "" });
    showToast("Password updated successfully", "success");
  };

  const closePasswordModal = () => {
    setPasswordModal((prev) => ({ ...prev, show: false }));
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const initials = () => {
    if (!user.username) {
      return "U";
    }
    const firstLetter = user.username.trim()[0];
    return /[a-z]/i.test(firstLetter) ? firstLetter.toUpperCase() : "U";
  };

  const ToastIcon = TOAST_ICON[toast.type] ?? FaInfoCircle;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Profile</span>
        <h1 className="text-3xl font-semibold text-gray-900">Account</h1>
        <p className="text-gray-500">Manage how SpendWise recognizes you and keep your details up to date.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleImageClick}
              className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100 transition-transform hover:scale-[1.02]"
            >
              {profileImage || user.profile_picture_url ? (
                <img
                  src={profileImage || user.profile_picture_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gray-900 text-3xl font-semibold text-white">
                  {initials()}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <FaCamera className="text-white" />
              </span>
            </button>
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Use a clear, high-resolution photo so teammates recognize you easily.
              </p>
              <button
                type="button"
                onClick={handleImageClick}
                className="mt-3 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 transition-colors hover:bg-gray-100"
              >
                Update Photo
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6">
            <div>
              <label className={LABEL_CLASSES} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={user.username}
                onChange={handleInputChange}
                className={INPUT_CLASSES}
                required
              />
            </div>

            <div>
              <label className={LABEL_CLASSES} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                className={INPUT_CLASSES}
                required
              />
            </div>

            <div>
              <label className={LABEL_CLASSES} htmlFor="phone_number">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={user.phone_number}
                onChange={handleInputChange}
                className={INPUT_CLASSES}
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto"
              >
                Change Password
              </button>
              <button
                type="submit"
                className="w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <section className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Account Snapshot</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Your Details</h2>
            <p className="mt-4 text-sm text-gray-500">
              Keep your contact information accurate; we use it for receipts, alerts, and secure verification steps.
            </p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <FaUser className="text-gray-400" />
              <span>{user.username}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-400">@</span>
              <span>{user.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-400">☎</span>
              <span>{user.phone_number || "No number added"}</span>
            </p>
          </div>
        </section>
      </div>

      {passwordModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Security</p>
                <h2 className="text-xl font-semibold text-gray-900">Update Password</h2>
              </div>
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className={LABEL_CLASSES} htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordModal.currentPassword}
                  onChange={handlePasswordInputChange}
                  className={INPUT_CLASSES}
                  required
                />
              </div>

              <div>
                <label className={LABEL_CLASSES} htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordModal.newPassword}
                  onChange={handlePasswordInputChange}
                  className={INPUT_CLASSES}
                  required
                />
              </div>

              <div>
                <label className={LABEL_CLASSES} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordModal.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className={INPUT_CLASSES}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-gray-700"
              >
                Save Password
              </button>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                  ? "alert-error"
                  : toast.type === "warning"
                    ? "alert-warning"
                    : "alert-info"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <ToastIcon className="text-lg" />
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
