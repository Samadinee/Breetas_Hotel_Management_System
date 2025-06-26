// /src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { getAllBookings, API_URL } from '../../api';
import { isAuthenticated, getUser } from '../../auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DashboardStats from './DashboardStats';
import FilterBar from './FilterBar';
import BookingsTable from './BookingsTable';
import SummaryModal from './SummaryModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    checkIn: '',
    checkOut: '',
    status: '',
    roomName: '',
    customer: ''
  });
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryType, setSummaryType] = useState('month');
  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUser()?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await getAllBookings(localStorage.getItem('token'));
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedBookings = bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        );
        setBookings(updatedBookings);
        Swal.fire('Success!', 'Booking status updated', 'success');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  const generateSummaryData = () => {
    const data = {};
    const labels = [];
    const counts = [];
    const revenues = [];

    bookings.forEach(booking => {
      const date = new Date(booking.checkInDate);
      let key;
      
      if (summaryType === 'month') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        key = date.getFullYear();
      }

      if (!data[key]) {
        data[key] = {
          count: 0,
          revenue: 0
        };
      }

      data[key].count++;
      data[key].revenue += booking.totalPrice;
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(data).sort();
    
    sortedKeys.forEach(key => {
      labels.push(key);
      counts.push(data[key].count);
      revenues.push(data[key].revenue);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Number of Bookings',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Revenue (Rs.)',
          data: revenues,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const showSummary = () => {
    setSummaryData(generateSummaryData());
    setShowSummaryModal(true);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(18);
    doc.text('Hotel Booking Reservations Report', 14, 20);
    
    // Add date and filters
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    
    let filtersText = 'Showing: All reservations';
    if (filters.checkIn || filters.checkOut || filters.status || filters.roomName || filters.customer) {
      filtersText = 'Filters: ';
      if (filters.checkIn) filtersText += `From ${filters.checkIn} `;
      if (filters.checkOut) filtersText += `To ${filters.checkOut} `;
      if (filters.status) filtersText += `Status: ${filters.status} `;
      if (filters.roomName) filtersText += `Room: ${filters.roomName} `;
      if (filters.customer) filtersText += `Customer: ${filters.customer}`;
    }
    doc.text(filtersText, 14, 36);
    
    // Prepare table data
    const tableData = filteredBookings.map(booking => [
      booking.roomId?.roomName || 'N/A',
      booking.userId?.username || 'N/A',
      booking.userId?.email || 'N/A',
      new Date(booking.checkInDate).toLocaleDateString(),
      new Date(booking.checkOutDate).toLocaleDateString(),
      booking.numberOfPersons,
      `Rs.${booking.totalPrice.toFixed(2)}`,
      booking.status
    ]);
    
    // Generate table
    autoTable(doc, {
      head: [['Room', 'Customer', 'Email', 'Check-In', 'Check-Out', 'Persons', 'Price', 'Status']],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 }
      }
    });
    
    // Add summary stats
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((total, booking) => total + booking.totalPrice, 0);
    const pending = filteredBookings.filter(b => b.status === 'Pending').length;
    const confirmed = filteredBookings.filter(b => b.status === 'Confirmed').length;
    const cancelled = filteredBookings.filter(b => b.status === 'Cancelled').length;
    
    doc.setFontSize(10);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Bookings: ${totalBookings}`, 14, finalY);
    doc.text(`Total Revenue: Rs.${totalRevenue.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Status: Pending (${pending}) | Confirmed (${confirmed}) | Cancelled (${cancelled})`, 
      14, finalY + 10);
    
    // Save the PDF
    doc.save(`reservations_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const filteredBookings = bookings.filter(booking => {
    const checkInMatch = filters.checkIn ? new Date(booking.checkInDate) >= new Date(filters.checkIn) : true;
    const checkOutMatch = filters.checkOut ? new Date(booking.checkOutDate) <= new Date(filters.checkOut) : true;
    const statusMatch = filters.status ? booking.status === filters.status : true;
    const roomNameMatch = filters.roomName ? (booking.roomId?.roomName || '').toLowerCase().includes(filters.roomName.toLowerCase()) : true;
    const customerMatch = filters.customer ? (booking.userId?.username || '').toLowerCase().includes(filters.customer.toLowerCase()) : true;
    return checkInMatch && checkOutMatch && statusMatch && roomNameMatch && customerMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {/* Dashboard Stats */}
        <DashboardStats bookings={bookings} />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Reservations
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={showSummary}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Summary
            </button>
            <button
              onClick={downloadAsPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />
        {/* Bookings Table */}
        <BookingsTable bookings={filteredBookings} handleStatusUpdate={handleStatusUpdate} />
      </main>
      {/* Summary Modal */}
      <SummaryModal
        show={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summaryType={summaryType}
        setSummaryType={(type) => {
          setSummaryType(type);
          setSummaryData(generateSummaryData());
        }}
        summaryData={summaryData}
        bookings={filteredBookings}
      />
    </div>
  );
}

export default AdminDashboard;