//<!-- /src/components/Navbar.js -->
import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 hover:bg-gray-700">Home</Link>
            <Link to="/rooms" className="px-3 py-2 hover:bg-gray-700">Rooms</Link>
            <Link to="/nearby-places" className="px-3 py-2 hover:bg-gray-700">Nearby Places</Link>
            <Link to="/restaurants" className="px-3 py-2 hover:bg-gray-700">Restaurants</Link>
            {isAuthenticated() && (
              <Link to="/my-reservations" className="px-3 py-2 hover:bg-gray-700">My Reservations</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;