import React from 'react';

function DashboardStats({ bookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
        <p className="text-3xl font-bold">{bookings.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Revenue</h2>
        <p className="text-3xl font-bold">
          Rs.{bookings.reduce((total, booking) => total + booking.totalPrice, 0).toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Pending Bookings</h2>
        <p className="text-3xl font-bold">
          {bookings.filter(b => b.status === 'Pending').length}
        </p>
      </div>
    </div>
  );
}

export default DashboardStats;
