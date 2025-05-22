import React, { useEffect, useState } from "react";
import api from "../api";

const PendingInvitesPopup = ({ onClose }) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending invites from API
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get("/api/friend/sent");
        const usernames = res.data.requests;
        // const usernames = ["Alice", "Bob", "Harshit ", "Suhani", "abc", "abc"]
        setInvites(usernames);
      } catch (err) {
        console.error("Failed to fetch invites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  // Dummy delete function
  const onDelete = (username) => {
    alert(`Pretend we deleted the invite to ${username}`);
    // Optionally remove from UI
    setInvites((prev) => prev.filter((u) => u !== username));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-[300px] rounded-2xl shadow-lg p-6 relative">
        {/* Close Button (Top-Left) */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center mb-4">
          Pending Invites
          <span className="ml-2 text-sm text-gray-600">({invites.length})</span>
        </h2>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : invites.length > 0 ? (
          <ul className="space-y-3 max-h-[200px] overflow-y-auto">
            {invites.map((username, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="text-gray-800">{username}</span>
                </div>
                <button
                  onClick={() => onDelete(username)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No pending requests.</p>
        )}
      </div>
    </div>
  );
};

export default PendingInvitesPopup;
