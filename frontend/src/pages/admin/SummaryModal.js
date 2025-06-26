import React from 'react';
import { Bar } from 'react-chartjs-2';

function SummaryModal({ show, onClose, summaryType, setSummaryType, summaryData, bookings }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Reservations Summary</h2>
          <div className="flex items-center space-x-4">
            <select
              value={summaryType}
              onChange={e => setSummaryType(e.target.value)}
              className="border px-3 py-1 rounded text-sm"
            >
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>
            <button
              onClick={onClose}
              className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Close
            </button>
          </div>
        </div>
        {summaryData && (
          <div className="h-96">
            <Bar
              data={summaryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: `Reservations by ${summaryType === 'month' ? 'Month' : 'Year'}`,
                    font: { size: 16 }
                  },
                  legend: { position: 'top' }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } }
                }
              }}
            />
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Total Bookings: {bookings.length}</h3>
            <h3 className="font-medium mb-2">Total Revenue: Rs.{bookings.reduce((total, booking) => total + booking.totalPrice, 0).toFixed(2)}</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Status Breakdown:</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Pending: {bookings.filter(b => b.status === 'Pending').length}
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Confirmed: {bookings.filter(b => b.status === 'Confirmed').length}
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Cancelled: {bookings.filter(b => b.status === 'Cancelled').length}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;
