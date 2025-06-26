//<!-- /src/pages/MyReservations.js -->
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMyBookings, cancelBooking } from '../api';
import { isAuthenticated } from '../auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function MyReservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await getMyBookings(localStorage.getItem('token'));
        setBookings(data);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch bookings',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelBooking(id, localStorage.getItem('token'));
          setBookings(bookings.filter(booking => booking._id !== id));
          Swal.fire(
            'Cancelled!',
            'Your booking has been cancelled.',
            'success'
          );
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to cancel booking',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">You don't have any reservations yet.</p>
            <a href="/rooms" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Browse Rooms
            </a>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <li key={booking._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{booking.roomId.roomName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.numberOfPersons} persons • Rs.{booking.totalPrice}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;