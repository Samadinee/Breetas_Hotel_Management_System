import React, { useState, useEffect, useRef } from 'react';
import { updateProfile } from '../api';
import { getUser } from '../auth';
import Swal from 'sweetalert2';

function UpdateProfileModal({ show, onClose, onSuccess, initialUser }) {
  const [userData, setUserData] = useState({
    username: initialUser.username || '',
    email: initialUser.email || '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialUser.profileImage || '');
  const [loading, setLoading] = useState(false);
  const prevShow = useRef(false);

  useEffect(() => {
    if (show && !prevShow.current) {
      setUserData({
        username: initialUser.username || '',
        email: initialUser.email || '',
      });
      setPreviewImage(initialUser.profileImage || '');
      setProfileImage(null);
    }
    prevShow.current = show;
  }, [show, initialUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.username.trim() || !userData.email.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Username and Email cannot be empty.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      let response;
      try {
        response = await updateProfile(formData, localStorage.getItem('token'));
      } catch (err) {
        // If fetch fails or returns HTML, show a friendly error
        Swal.fire({
          title: 'Error!',
          text: 'Could not connect to the server or received an invalid response.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }
      if (response && response.success) {
        const userFromStorage = getUser();
        const updatedUser = {
          ...userFromStorage,
          username: userData.username,
          email: userData.email,
          profileImage: response.profileImage || userFromStorage?.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          onSuccess(updatedUser);
        });
      } else {
        throw new Error((response && response.message) || 'Profile update failed');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                {userData.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <label htmlFor="profileImageModal" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <input 
                id="profileImageModal" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="usernameModal" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="usernameModal"
              name="username"
              type="text"
              value={userData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="emailModal" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="emailModal"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfileModal;
