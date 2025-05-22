import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import api from '../api'
import PendingInvitesPopup from './PendingInvitePopup';

export default function Friends({ authState }) {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchBy, setSearchBy] = useState("username");
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [pendingInvitesPopup, showPendingInvitesPopup] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const goToLogin = () => navigate("/login");

  useEffect(() => {
    if (authState.isAuthenticated) {
      const fetchFriends = async () => {
        try {
          const res = await api.get('/api/friends');
          setFriends(res.data.friends); // expected shape: [{ username, lastSeen }]
        } catch (err) {
          console.error("Failed to load friends", err);
        }
      };
      fetchFriends();
    }
  }, [authState.isAuthenticated]);

  // Debounced fetch for username suggestions
  const fetchSuggestions = useCallback(debounce(async (query, searchBy) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await api.get(`/api/search`, {
        params: { query, searchBy }
      });
      setSuggestions(res.data.users);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  }, 300), []);

  useEffect(() => {
    fetchSuggestions(username, searchBy);
  }, [username, searchBy]);

  const addFriend = async () => {
    try {
      const response = await api.post("/api/friend/request", {
        username,
        searchBy
      });

      if (response.status === 200) {
        alert("Friend Request Sent Successfully");
        setUsername("");
        setSuggestions([]);
        setShowAddPopup(false);
      }
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to send friend request");
    }
  };

  const showPendingInvites = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/api/friend/sent", {
      //   withCredentials: true
      // });

      // const usernames = response.data.requests;
      // setPendingInvites(usernames);
      showPendingInvitesPopup(true);
    } catch (error) {
      console.error("Failed to fetch pending invites:", error);
    }
  };

  // const handlePendingInvitesDelete = () => {
  //   alert("Invite is Deleted!");
  // };

  const fetchFriendRequests = async () => {
    try{
      const response = await api.get('/api/friend/receiveRequests');
      const request = response.data.requests;
      const count = response.data.count;
      setPendingCount(count);
      setRequests(request);
    }catch(err){
      alert("Failed to fetch Friend Requests");
    }
    
  }

  useEffect(() => {
    // Fetch immediately on mount
    fetchFriendRequests();

    // Set interval to fetch every 10 seconds (adjust as needed)
    const interval = setInterval(() => {
      fetchFriendRequests();
    }, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);


const respondToFriendRequest = async (action, senderUsername) => {
  try {
    const response = await api.post('/api/friend/respond', {
      senderUsername,
      action,
    });

    // axios automatically throws on non-2xx, so this is for successful response
    alert(response.data.message);
  } catch (error) {
    // error.response exists if server responded with error status
    if (error.response) {
      alert(error.response.data.message || 'Something went wrong');
    } else {
      // Network or other error
      alert('Network error');
    }
  }
};


  return (
    <>
      {!authState.isAuthenticated ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Please log in to view your friends.
          </h2>
          <button
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 min-h-screen pt-[100px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Your Friends</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddPopup(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
              >
                Add Friend
              </button>
              <button
                onClick={showPendingInvites}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 shadow"
              >
                Pending Invites
              </button>
              <span className="relative">
                <button
                  onClick={() => {fetchFriendRequests(); setShowRequests(true);}}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
                >
                  Friend Requests
                </button>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-s px-2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </span>
            </div>
          </div>

          {friends.length === 0 && (
            <p className="text-left text-gray-500 italic mb-4 text-xl mt-4">
              You don't have any friends yet. Start by adding someone!
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map(friend => (
              <div
                key={friend.username}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                  {friend.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-medium">{friend.username}</div>
                  <div className="text-sm text-gray-500">Last seen: {new Date(friend.lastSeen).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {showAddPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>

                {/* Search Type Checkboxes */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={searchBy === "username"}
                      onChange={() => { setSearchBy("username"); setUsername(""); }}
                    />
                    Username
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={searchBy === "email"}
                      onChange={() => { setSearchBy("email"); setUsername(""); }}
                    />
                    Email
                  </label>
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2 outline-none"
                  placeholder={`Enter friend's ${searchBy}`}
                />

                {/* Suggestions List */}
                <div className="border border-gray-300 rounded p-2 mb-4 max-h-40 overflow-y-auto">
                  {username && suggestions.length > 0 ? (
                    <ul className="space-y-1">
                      {suggestions.map(user => (
                        <li
                          key={user[searchBy]}
                          onClick={() => {
                            setUsername(user[searchBy]);
                            setSuggestions([]);
                          }}
                          className="p-2 hover:bg-blue-100 cursor-pointer rounded"
                        >
                          {user[searchBy]}
                        </li>
                      ))}
                    </ul>
                  ) : username && suggestions.length === 0 ? (
                    <p className="text-gray-500">No {searchBy} found</p>
                  ) : null}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowAddPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addFriend}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          {showRequests && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-6 w-80 relative">
                <button
                  onClick={() => setShowRequests(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✖
                </button>

                <h3 className="text-lg font-semibold mb-4 text-center">Friend Requests</h3>

                {requests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No pending requests</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {requests.map(req => (
                      <div
                        key={req._id}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded"
                      >
                        <span>{req.sender.username}</span>
                        <div className="space-x-2">
                          <button
                            className="text-green-600 hover:text-green-800"
                            onClick={() => respondToFriendRequest('accept', req.sender.username)}
                          >
                            ✔
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => respondToFriendRequest('reject', req.sender.username)}
                          >
                            ✖
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            </div>
          )}

          {pendingInvitesPopup && (
            <PendingInvitesPopup
              // invites={pendingInvites}
              onClose={() => showPendingInvitesPopup(false)}
              // onDelete={handlePendingInvitesDelete}
            />
          )}
        </div>
      )}
    </>
  );
}
