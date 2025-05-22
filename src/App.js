import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Friends from "./pages/Friends";
import './index.css';
import NotificationPopup from "./pages/NotificationPopup";
import socket from "./pages/socket";
import api from "./api";

function App() {
  
  const [authState, setAuthState] = useState({
    username: "",
    isAuthenticated: false,
    isLoading: true,
    socketRegistered: false
  });

  const APi = "https://geo-tracker-backend.onrender.com";
  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await api.get("/api/user");
      const username = response.data.user.username;

      // ✅ Emit only if not already registered
      if (!authState.socketRegistered) {
        socket.emit('register-user', username);
      }

      setAuthState({
        username,
        isAuthenticated: true,
        isLoading: false,
        socketRegistered: true  // ✅ Set flag
      });

    } catch (error) {
      setAuthState({
        username: "",
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <NotificationPopup>
      <Router>
        <Navbar authState={authState} setAuthState={setAuthState} />
        <div>
          <Routes>
            <Route path="/" element={<Home authState={authState} />} />
            <Route 
              path="/login" 
              element={
                authState.isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setAuthState={setAuthState} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                authState.isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register setAuthState={setAuthState} />
                )
              } 
            />
            <Route 
              path="/friends" 
              element={<Friends authState={authState} />} 
            />
          </Routes>
        </div>
      </Router>
    </NotificationPopup>
  );
}

export default App;