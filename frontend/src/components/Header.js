// /src/components/Header.js
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../auth';
import Swal from 'sweetalert2';
import { API_URL } from '../api';

function Header() {
  const navigate = useNavigate();
  const user = getUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
      }
    });
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Hotel Breeta's Garden</Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated() ? (
            <div className="flex items-center space-x-4" ref={dropdownRef}>
              <button
                className="flex items-center space-x-1 focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <span className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage.startsWith('http')
                        ? user.profileImage
                        : `${API_URL.replace(/\/api$/, '')}${user.profileImage.startsWith('/') ? user.profileImage : '/' + user.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase()
                  )}
                </span>
                <span>{user?.username}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/register" className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-blue-50">Register</Link>
              <Link to="/login" className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;