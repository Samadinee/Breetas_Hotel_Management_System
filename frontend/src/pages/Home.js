// /src/pages/Home.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getRooms } from '../api';
import RoomCard from '../components/RoomCard';
import { isAuthenticated } from '../auth';
import backgroundImage from '../images/background.jpeg';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data.slice(0, 3)); // Show only 3 rooms on home page
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[41rem] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Hotel Breeta's Garden</h1>
          <p className="text-xl text-white mb-8">Luxury and comfort await you.</p>
          <a 
            href="/rooms" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Book Your Stay
          </a>
          {/* Register/Login below the image */}
          {!isAuthenticated() && (
            <div className="flex justify-center space-x-4 mt-8">
              <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
                Register
              </a>
              <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                Login
              </a>
            </div>
          )}
        </div>
      </div>
      

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Rooms</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;