import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ authState }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/welcomeImage.png')" }}
    >
      {/* Welcome Heading */}
      <div className="absolute pt-[22px] top-12 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold drop-shadow-lg">Welcome to GeoTracker</h1>
        {authState?.isAuthenticated && (
          <p className="mt-2 text-lg bg-black/50 px-4 py-2 rounded-full">
            Hi, {authState.username || 'there'} 👋
          </p>
        )}
      </div>

      {/* Login button */}
      {!authState?.isAuthenticated && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
