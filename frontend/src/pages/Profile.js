// /src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../auth';
import Swal from 'sweetalert2';
import UpdateProfileModal from './UpdateProfileModal';
import { API_URL } from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Navbar from '../components/Navbar';

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profileImage: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL.replace(/\/api$/, '')}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            username: data.username || '',
            email: data.email || '',
            profileImage: data.profileImage || ''
          });
          // Update localStorage so getUser() stays in sync
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          // fallback to local user if fetch fails
          setUserData({
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            profileImage: currentUser?.profileImage || ''
          });
        }
      } catch (err) {
        setUserData({
          username: currentUser?.username || '',
          email: currentUser?.email || '',
          profileImage: currentUser?.profileImage || ''
        });
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const handleDeleteAccount = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
        Swal.fire(
          'Deleted!',
          'Your account has been deleted.',
          'success'
        );
      }
    });
  };

  // Reset imgError when modal closes or userData.profileImage changes
  useEffect(() => {
    setImgError(false);
  }, [userData.profileImage, showModal]);

  return (
    <>
      {currentUser && currentUser.role === 'admin' ? <AdminNavbar /> : <Navbar />}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {(() => {
                  let imgSrc = userData.profileImage && (userData.profileImage.startsWith('http')
                    ? userData.profileImage
                    : `${API_URL.replace(/\/api$/, '')}${userData.profileImage.startsWith('/') ? userData.profileImage : '/' + userData.profileImage}`);
                  return userData.profileImage && !imgError ? (
                    <>
                      <img
                        src={imgSrc}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                        onError={e => { setImgError(true); }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                        {userData.username?.charAt(0).toUpperCase()}
                      </div>
                      {userData.profileImage && imgError && (
                        <div className="text-xs text-red-500 mt-1">Image failed to load</div>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{userData.username || <span className="italic text-gray-400">No username</span>}</div>
                <div className="text-gray-500">{userData.email || <span className="italic text-gray-400">No email</span>}</div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <UpdateProfileModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={(updatedUser) => {
            setUserData({
              username: updatedUser.username,
              email: updatedUser.email,
              profileImage: updatedUser.profileImage || ''
            });
            setShowModal(false);
          }}
          initialUser={userData}
        />
      </div>
    </>
  );
}

export default Profile;