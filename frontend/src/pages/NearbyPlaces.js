//<!-- /src/pages/NearbyPlaces.js -->
import React from 'react';
import Navbar from '../components/Navbar';

function NearbyPlaces() {
  const places = [
    { name: 'Shopping Mall', distance: '0.5 km', description: 'Large shopping center with various stores and restaurants' },
    { name: 'City Park', distance: '1.2 km', description: 'Beautiful park with walking trails and picnic areas' },
    { name: 'Museum', distance: '2.5 km', description: 'Local history and art museum' },
    { name: 'Beach', distance: '3.0 km', description: 'Sandy beach with ocean views' },
    { name: 'Convention Center', distance: '1.8 km', description: 'Large venue for events and conferences' },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nearby Places</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Place Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-2">{place.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{place.distance} away</span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NearbyPlaces;