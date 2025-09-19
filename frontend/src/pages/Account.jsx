import React, { useState, useRef } from 'react';
import { 
  FaUser, 
  FaCamera, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';

export default function Account() {
  const [user, setUser] = useState({
    username: 'John Doe',
    email: 'johndoe@email.com',
    phone_number: '123456789',
    profile_picture_url: null
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // Add toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' // 'info', 'success', 'warning', 'error'
  });
  
  // Add password change modal state
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Update the preview image
      setProfileImage(imageUrl);
      
      // Also update the user object with the new profile picture URL
      setUser({
        ...user,
        profile_picture_url: imageUrl
      });
      
      // Show toast for successful image upload
      showToast('Profile image updated', 'success');
    }
  };
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!user.username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }
    
    if (!user.email.trim()) {
      showToast('Email cannot be empty', 'error');
      return;
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // In a real app, you would make an API call to update the profile
    console.log('Profile update data:', user);
    
    // Show success toast
    showToast('Profile updated successfully', 'success');
  };
  
  const handleChangePassword = () => {
    setPasswordModal({
      show: true,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordModal({
      ...passwordModal,
      [name]: value
    });
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Password validation
    if (!passwordModal.currentPassword) {
      showToast('Current password cannot be empty', 'error');
      return;
    }
    
    if (!passwordModal.newPassword) {
      showToast('New password cannot be empty', 'error');
      return;
    }
    
    if (passwordModal.newPassword !== passwordModal.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    // Check if current password is correct (in a real app, this would be done on the server)
    if (passwordModal.currentPassword !== 'password123') {  // Example check
      showToast('Current password is incorrect', 'error');
      return;
    }
    
    // Password complexity check
    if (passwordModal.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    // In a real app, you would make an API call to update the password
    console.log('Password change submitted');
    
    // Close modal and show success toast
    setPasswordModal({
      show: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    showToast('Password updated successfully', 'success');
  };
  
  const closePasswordModal = () => {
    setPasswordModal({
      ...passwordModal,
      show: false
    });
  };
  
  // Helper function to show toast
  const showToast = (message, type = 'info') => {
    setToast({
      show: true,
      message,
      type
    });
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({...prev, show: false}));
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <div 
          className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden cursor-pointer relative"
          onClick={handleImageClick}
        >
          {profileImage || user.profile_picture_url ? (
            <img 
              src={profileImage || user.profile_picture_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-medium">
              {user.username && /^[a-zA-Z]/.test(user.username) ? 
                user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <FaCamera className="text-white text-xl" />
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input 
            type="text" 
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone_number"
            value={user.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="pt-4">
          <button 
            type="button"
            onClick={handleChangePassword}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-4"
          >
            Change Password
          </button>
          
          <button 
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </form>
      
      {/* Password Change Modal */}
      {passwordModal.show && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <button 
                onClick={closePasswordModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={passwordModal.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={passwordModal.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Re-enter Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={passwordModal.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* DaisyUI Toast */}
      {toast.show && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${
            toast.type === 'success' ? 'alert-success' : 
            toast.type === 'error' ? 'alert-error' : 
            toast.type === 'warning' ? 'alert-warning' : 
            'alert-info'
          } shadow-lg`}>
            <div className="flex items-center">
              {toast.type === 'success' && (
                <FaCheckCircle className="flex-shrink-0 h-6 w-6 mr-2" />
              )}
              {toast.type === 'error' && (
                <FaExclamationCircle className="flex-shrink-0 h-6 w-6 mr-2" />
              )}
              {toast.type === 'warning' && (
                <FaExclamationTriangle className="flex-shrink-0 h-6 w-6 mr-2" />
              )}
              {toast.type === 'info' && (
                <FaInfoCircle className="flex-shrink-0 h-6 w-6 mr-2" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
