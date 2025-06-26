//<!-- /src/pages/Rooms.js -->
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import { getRooms } from '../api';
import { isAuthenticated } from '../auth';
import Swal from 'sweetalert2';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch rooms',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Determine if any filter is active
  const isAnyFilterActive = (
    searchTerm.trim() !== '' ||
    capacityFilter !== '' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000
  );

  const filteredRooms = isAnyFilterActive
    ? rooms.filter(room => {
        const matchesSearch = room.roomName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCapacity = capacityFilter ? room.capacity >= parseInt(capacityFilter) : true;
        const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
        return matchesSearch && matchesCapacity && matchesPrice;
      })
    : rooms;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Rooms</h1>
        
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4+ Persons</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;