import React from 'react';

function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-xs font-medium text-gray-700">Check-in From</label>
        <input 
          type="date" 
          value={filters.checkIn} 
          onChange={e => setFilters(f => ({...f, checkIn: e.target.value}))} 
          className="border px-2 py-1 rounded text-sm" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Check-out To</label>
        <input 
          type="date" 
          value={filters.checkOut} 
          onChange={e => setFilters(f => ({...f, checkOut: e.target.value}))} 
          className="border px-2 py-1 rounded text-sm" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Status</label>
        <select 
          value={filters.status} 
          onChange={e => setFilters(f => ({...f, status: e.target.value}))} 
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Room Name</label>
        <input 
          type="text" 
          value={filters.roomName} 
          onChange={e => setFilters(f => ({...f, roomName: e.target.value}))} 
          placeholder="Room name" 
          className="border px-2 py-1 rounded text-sm" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Customer</label>
        <input 
          type="text" 
          value={filters.customer} 
          onChange={e => setFilters(f => ({...f, customer: e.target.value}))} 
          placeholder="Customer name" 
          className="border px-2 py-1 rounded text-sm" 
        />
      </div>
    </div>
  );
}

export default FilterBar;
