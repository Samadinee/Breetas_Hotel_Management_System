// /src/components/RoomCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';

function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        {room.image ? (
          <img 
            src={room.image.startsWith('http') ? room.image : `http://localhost:5000/${room.image.replace(/^\/+/,'')}`}
            alt={room.roomName} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-gray-500">Room Image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{room.roomName}</h3>
        <p className="text-gray-600 mb-2">{room.facilities}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-600 font-bold">${room.price}/night</span>
          <span className="text-sm text-gray-500">Capacity: {room.capacity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded ${room.availableRooms > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {room.availableRooms > 0 ? 'Available' : 'Sold Out'}
          </span>
          {isAuthenticated() ? (
            <Link 
              to={`/book-room/${room._id}`} 
              className={`px-3 py-1 rounded text-white ${room.availableRooms > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={room.availableRooms <= 0}
            >
              Book Now
            </Link>
          ) : (
            <button 
              className="px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed" 
              disabled
              title="Please login to book"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomCard;