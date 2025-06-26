// /src/pages/admin/RoomModal.js
import React from 'react';

function RoomModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  previewImage,
  title,
  submitLabel
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
            <input type="text" name="roomName" value={form.roomName} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
            <input type="text" name="facilities" value={form.facilities} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" name="price" value={form.price} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input type="number" name="capacity" value={form.capacity} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
            <input type="number" name="totalRooms" value={form.totalRooms} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Rooms</label>
            <input type="number" name="availableRooms" value={form.availableRooms} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Image</label>
            <input type="file" name="image" accept="image/*" onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default RoomModal;
