//<!-- /src/pages/BookRoom.js -->
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, bookRoom } from '../api';
import { isAuthenticated, getUser } from '../auth';
import Swal from 'sweetalert2';

function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    roomId: id,
    numberOfPersons: 1,
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to book a room',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchRoom = async () => {
      try {
        const data = await getRoomById(id);
        setRoom(data);
        setBookingData(prev => ({
          ...prev,
          numberOfPersons: data.capacity > 1 ? 2 : 1
        }));
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch room details',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]);

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
      const response = await bookRoom(bookingData, localStorage.getItem('token'));
      if (response._id) {
        Swal.fire({
          title: 'Success!',
          text: 'Room booked successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/my-reservations');
        });
      } else {
        throw new Error(response.message || 'Booking failed');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book {room.roomName}</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price per night:</span>
              <span className="font-bold">${room.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-bold">{room.capacity} persons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available rooms:</span>
              <span className="font-bold">{room.availableRooms}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={user._id}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

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
    </div>
  );
}

export default BookRoom;