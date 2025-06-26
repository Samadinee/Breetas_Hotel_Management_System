// /src/pages/admin/AllRooms.js
import React, { useState, useEffect } from 'react';
import { getRooms, deleteRoom, addRoom, updateRoom } from '../../api';
import { isAuthenticated, getUser } from '../../auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminNavbar from '../../components/AdminNavbar';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';

function AllRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [roomForm, setRoomForm] = useState({
    roomName: '',
    facilities: '',
    price: 0,
    capacity: 1,
    totalRooms: 1,
    availableRooms: 1,
    image: null,
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!isAuthenticated() || getUser()?.role !== 'admin') {
      navigate('/login');
      return;
    }

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
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setRoomForm(prev => ({ ...prev, image: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setRoomForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRoom = async () => {
    try {
      const formData = new FormData();
      Object.entries(roomForm).forEach(([key, value]) => {
        if (value !== null && value !== '') formData.append(key, value);
      });
      const response = await addRoom(formData, localStorage.getItem('token'));
      if (response._id) {
        setRooms([...rooms, response]);
        setShowAddModal(false);
        Swal.fire({
          title: 'Success!',
          text: 'Room added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setRoomForm({
          roomName: '',
          facilities: '',
          price: 0,
          capacity: 1,
          totalRooms: 1,
          availableRooms: 1,
          image: null,
        });
        setPreviewImage('');
      } else {
        throw new Error(response.message || 'Failed to add room');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const formData = new FormData();
      Object.entries(roomForm).forEach(([key, value]) => {
        if (key === 'image') {
          if (value && typeof value !== 'string') {
            formData.append('image', value);
          }
        } else {
          formData.append(key, value);
        }
      });
      const response = await updateRoom(
        currentRoom._id,
        formData,
        localStorage.getItem('token')
      );
      if (response._id) {
        setRooms(rooms.map(room =>
          room._id === currentRoom._id ? response : room
        ));
        setShowEditModal(false);
        Swal.fire({
          title: 'Success!',
          text: 'Room updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        throw new Error(response.message || 'Failed to update room');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteRoom = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRoom(id, localStorage.getItem('token'));
          setRooms(rooms.filter(room => room._id !== id));
          Swal.fire(
            'Deleted!',
            'Room has been deleted.',
            'success'
          );
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete room',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  const openEditModal = (room) => {
    setCurrentRoom(room);
    setRoomForm({
      roomName: room.roomName,
      facilities: room.facilities,
      price: room.price,
      capacity: room.capacity,
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
    });
    setShowEditModal(true);
  };

  const filteredRooms = rooms.filter(room =>
    room.roomName.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">All Rooms</h1>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Search by room name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-64"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Room
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={openEditModal}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      </main>
      {/* Add Room Modal */}
      <RoomModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddRoom}
        form={roomForm}
        onChange={handleInputChange}
        previewImage={previewImage}
        title="Add New Room"
        submitLabel="Add Room"
      />
      {/* Edit Room Modal */}
      <RoomModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateRoom}
        form={roomForm}
        onChange={handleInputChange}
        previewImage={previewImage}
        title="Edit Room"
        submitLabel="Update Room"
      />
    </div>
  );
}

export default AllRooms;