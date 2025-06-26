import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/admin/dashboard" className="px-3 py-2 hover:bg-gray-700 font-bold">Dashboard</Link>
            <Link to="/admin/rooms" className="px-3 py-2 hover:bg-gray-700">Rooms</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;