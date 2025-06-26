// frontend/src/components/BookRoomModal.js
import React, { useState } from 'react';
import { bookRoom } from '../api';
import { isAuthenticated, getUser } from '../auth';
import Swal from 'sweetalert2';

function BookRoomModal({ room, isOpen, onClose, onBooked }) {
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    roomId: room?._id || '',
    userId: user?._id || '',
    userEmail: user?.email || '',
    numberOfPersons: room?.capacity > 1 ? 2 : 1,
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: ''
  });

  React.useEffect(() => {
    if (user && user.email) {
      setBookingData(prev => ({
        ...prev,
        userEmail: user.email,
        userId: user._id,
      }));
    }
    if (room) {
      setBookingData(prev => ({
        ...prev,
        roomId: room._id,
        numberOfPersons: room.capacity > 1 ? 2 : 1,
      }));
    }
  }, [room, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Frontend validation: checkInDate < checkOutDate
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      if (checkIn >= checkOut) {
        Swal.fire({
          title: 'Error!',
          text: 'Check-out date must be after check-in date',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }
      // Optionally: check numberOfPersons > 0 and <= room.capacity
      if (
        Number(bookingData.numberOfPersons) < 1 ||
        Number(bookingData.numberOfPersons) > room.capacity
      ) {
        Swal.fire({
          title: 'Error!',
          text: `Number of persons must be between 1 and ${room.capacity}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }
      const response = await bookRoom(bookingData, localStorage.getItem('token'));
      if (response._id) {
        Swal.fire({
          title: 'Success!',
          text: 'Room booked successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          onBooked && onBooked();
          onClose();
        });
      } else {
        // Show backend error (e.g. room fully booked for a date)
        Swal.fire({
          title: 'Error!',
          text: response.message || 'Booking failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book {room.roomName}</h2>
        <form onSubmit={handleSubmit}>
          {/* User ID (hidden) */}
          <input type="hidden" name="userId" value={bookingData.userId} />
          <div className="mb-4">
            <label htmlFor="numberOfPersons" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Persons
            </label>
            <input
              id="numberOfPersons"
              name="numberOfPersons"
              type="number"
              min="1"
              max={room.capacity}
              value={bookingData.numberOfPersons}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={bookingData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                id="checkInDate"
                name="checkInDate"
                type="date"
                required
                value={bookingData.checkInDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                id="checkOutDate"
                name="checkOutDate"
                type="date"
                required
                value={bookingData.checkOutDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookRoomModal;
