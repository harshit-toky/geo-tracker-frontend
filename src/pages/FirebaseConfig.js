// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyD3EgTbSrDtLhr0b1n9jIoaDntWnRdsSFE",
    authDomain: "geo-tracker-1a432.firebaseapp.com",
    projectId: "geo-tracker-1a432",
    storageBucket: "geo-tracker-1a432.firebasestorage.app",
    messagingSenderId: "1008627712931",
    appId: "1:1008627712931:web:014e7358360815efcb9016",
    measurementId: "G-NLM6PWGD9N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = getMessaging(app);

// Request permission and get FCM token
const getFcmToken = async () => {
  try {
    await requestPermission();
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    // console.log('ServiceWorker registration successful with scope: ', registration.scope);

    // Then get the token using the registration
    const token = await getToken(messaging, { 
      vapidKey: "BIi9XvC8lJ-BAEI0lCMcW4BMRmeRRFvP2QH1EJrFaehV6zsLpZkbvZEk7OKNpH-LTK0GdRcOoX5-gtNGiIiYE1c",
      serviceWorkerRegistration: registration
    });
    
    // console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.log("Error getting FCM token", err);
    return null;
  }
};

const requestPermission = async () => {
  try {
    await Notification.requestPermission();
  } catch (err) {
    console.error("Error requesting notification permission", err);
  }
};

export { getFcmToken };

