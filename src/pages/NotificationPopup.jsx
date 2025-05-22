import React, { useEffect, useState } from 'react';
import socket from './socket';
import api from '../api';

const NotificationPopup = ({ children }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    socket.on('friend_request', (data) => {
      setNotification({
        username: data.from,
        message: data.message,
      });
    });

    socket.on('friend_request_accepted', (data) => {
      alert(`${data.by} accepted your friend request!`);
    });

    socket.on('friendRequest:rejected', (data) => {
      alert(`${data.receiver} rejected your friend request.`);
    });

    return () => {
      socket.off('friend_request');
      socket.off('friend_request_accepted');
      socket.off('friendRequest:rejected');
    };
  }, []);

  const closePopup = () => {
    setNotification(null);
  };

  const respondToFriendRequest = async (action, senderUsername) => {
    try {
      const response = await api.post('/api/friend/respond', {
        senderUsername,
        action,
      });

      // axios automatically throws on non-2xx, so this is for successful response
      alert(response.data.message);
      closePopup();
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
      {children}

      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center animate-fade-in">

            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={closePopup}
            >
              ✖
            </button>

            {/* Avatar */}
            <div className="mx-auto w-24 h-24 bg-blue-500 text-white text-4xl rounded-full flex items-center justify-center font-bold mb-4">
              {notification.username?.[0]?.toUpperCase()}
            </div>

            {/* Username */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {notification.username}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">{notification.message}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => respondToFriendRequest("accept", notification.username)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => respondToFriendRequest("reject", notification.username)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPopup;
