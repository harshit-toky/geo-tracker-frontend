import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ authState, setAuthState }) => {
  // const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const api = 'https://geo-tracker-backend.onrender.com';
  // Check session on component mount and when navigate changes
  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/user", {withCredentials: true});
  //       setUserName(response.data.user.username);
  //       localStorage.setItem("geo-username", response.data.user.username);
  //     } catch (error) {
  //       localStorage.removeItem("geo-username");
  //       setUserName("");
  //     }
  //   };
    
  //   checkSession();
  // }, [navigate]); // Add navigate to dependency array

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      // await axios.post("http://localhost:5000/api/logout", {}, {
      //   withCredentials: true
      // });
      await axios.post(`${api}/api/logout`, {}, {
        withCredentials: true
      });
      setAuthState({ username: "", isAuthenticated: false, isLoading: false });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white fixed w-full z-10 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <div className="text-2xl font-extrabold">🌍 GeoTracker</div>
        <Link to="/" className="text-lg hover:text-yellow-200">Home</Link>
      </div>

      {/* Right Section */}
      <div>
        {authState.username === "" ? (
          <Link to="/login" className="text-lg hover:text-yellow-200">
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-md italic"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold">
                {authState.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold">{authState.username}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-black">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;