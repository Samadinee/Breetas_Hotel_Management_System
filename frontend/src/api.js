// /src/api.js
export const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

export const getRooms = async () => {
  const response = await fetch(`${API_URL}/rooms`);
  return await response.json();
};

export const getRoomById = async (id) => {
  const response = await fetch(`${API_URL}/rooms/${id}`);
  return await response.json();
};

export const bookRoom = async (bookingData, token) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  return await response.json();
};

export const getMyBookings = async (token) => {
  const response = await fetch(`${API_URL}/bookings/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const cancelBooking = async (id, token) => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const updateProfile = async (formData, token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};

export const getAllBookings = async (token) => {
  const response = await fetch(`${API_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const addRoom = async (roomData, token) => {
  let options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: roomData,
  };
  // If not FormData, treat as JSON
  if (!(roomData instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(roomData);
  }
  const response = await fetch(`${API_URL}/rooms`, options);
  return await response.json();
};

export const updateRoom = async (roomId, roomData, token) => {
  let options = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: roomData,
  };
  if (!(roomData instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(roomData);
  }
  const response = await fetch(`${API_URL}/rooms/${roomId}`, options);
  return await response.json();
};

export const deleteRoom = async (roomId, token) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};