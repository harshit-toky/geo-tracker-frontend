import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './index.css';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    isAuthenticated: false,
    isLoading: true
  });
  const APi = "https://geo-tracker-backend.onrender.com";
  // Check authentication status
  const checkAuth = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/api/user", {
      //   withCredentials: true
      // });
      const response = await axios.get(`${APi}/api/user`, {
          withCredentials: true
        });
      setAuthState({
        username: response.data.user.username,
        isAuthenticated: true,
        isLoading: false
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
    <Router>
      <Navbar authState={authState} setAuthState={setAuthState} />
      <div className="pt-20 px-6">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;