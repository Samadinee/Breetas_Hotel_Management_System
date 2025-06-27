// src/pages/NearbyPlaces.js
import React from 'react';
import Navbar from '../components/Navbar';

function NearbyPlaces() {
  const places = [
    { 
      name: 'Devon Falls', 
      distance: '5 km', 
      description: 'Beautiful 97m waterfall, one of Sri Lanka\'s most scenic', 
      mapLink: 'https://maps.google.com/?q=Devon+Falls,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1589394815804-9648adb3d7e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      name: 'St. Clair\'s Falls', 
      distance: '12 km', 
      description: 'Known as "Little Niagara of Sri Lanka", stunning twin falls', 
      mapLink: 'https://maps.google.com/?q=St+Clairs+Falls,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      name: 'Castlereigh Reservoir', 
      distance: '8 km', 
      description: 'Picturesque man-made lake surrounded by tea plantations', 
      mapLink: 'https://maps.google.com/?q=Castlereigh+Reservoir,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      name: 'Ginigathena Tea Factory', 
      distance: '2 km', 
      description: 'See the tea production process and enjoy fresh Ceylon tea', 
      mapLink: 'https://maps.google.com/?q=Ginigathena+Tea+Factory,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      name: 'Kothmale Oya', 
      distance: '3 km', 
      description: 'Perfect river spot for fishing and picnics', 
      mapLink: 'https://maps.google.com/?q=Kothmale+Oya,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      name: 'Pundaluoya Railway Station', 
      distance: '15 km', 
      description: 'Colonial-era station with scenic train rides', 
      mapLink: 'https://maps.google.com/?q=Pundaluoya+Railway+Station,+Sri+Lanka',
      image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nearby Places in Ginigathena</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-2">{place.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">{place.distance} away</span>
                  <a 
                    href={place.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View on Map
                  </a>
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