// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyD3EgTbSrDtLhr0b1n9jIoaDntWnRdsSFE",
  authDomain: "geo-tracker-1a432.firebaseapp.com",
  projectId: "geo-tracker-1a432",
  storageBucket: "geo-tracker-1a432.firebasestorage.app",
  messagingSenderId: "1008627712931",
  appId: "1:1008627712931:web:014e7358360815efcb9016",
  measurementId: "G-NLM6PWGD9N"
});

const messaging = firebase.messaging();

// Optional: Add background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});