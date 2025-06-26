// /src/pages/admin/RoomCard.js
import React from 'react';

function RoomCard({ room, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
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
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <span className="text-sm text-gray-500">Price:</span>
            <p className="font-bold">Rs.{room.price}/night</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Capacity:</span>
            <p className="font-bold">{room.capacity} persons</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total Rooms:</span>
            <p className="font-bold">{room.totalRooms}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Available:</span>
            <p className="font-bold">{room.availableRooms}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onEdit(room)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(room._id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
