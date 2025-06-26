//<!-- /src/App.js -->
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Rooms from './pages/Rooms';
import BookRoom from './pages/BookRoom';
import MyReservations from './pages/MyReservations';
import NearbyPlaces from './pages/NearbyPlaces';
import UpdateProfile from './pages/UpdateProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllRooms from './pages/admin/AllRooms';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/book-room/:id" element={<BookRoom />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/nearby-places" element={<NearbyPlaces />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/rooms" element={<AllRooms />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;