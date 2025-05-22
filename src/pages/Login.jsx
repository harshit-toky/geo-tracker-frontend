import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getFcmToken } from "./FirebaseConfig";
import socket from "./socket";

const Login = ({ setAuthState}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const fcmToken = await getFcmToken();
            if (!fcmToken) {
        console.warn('FCM token not available (might be due to blocked notifications)');
      }
      const response = await api.post("/api/login", 
        { username, password, fcmToken }
      );
      // console.log('Full response:', response); // Debug log

      try{
      setAuthState({
        username: username,
        isAuthenticated: true,
        isLoading: false,
        socketRegistered: true
      });

      if (socket.connected) {
        socket.emit('register-user', username);
      } else {
        socket.once('connect', () => {
          socket.emit('register-user', username);
        });
      }

      navigate("/");
    }catch(err){
      console.log("Post-login error");
    }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login to GeoTracker</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">New here?</p>
          <button
            onClick={() => navigate("/register")}
            className="mt-2 text-indigo-600 font-semibold hover:underline"
          >
            Create a new account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
