import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// REPLACE THIS WITH THE CONFIG FIREBASE GAVE YOU
const firebaseConfig = {
  apiKey: "AIzaSyCz8WBlnp7ajJQqyQ5ekkeoE-rGtdpE1Qw",
  authDomain: "decide4me-776c6.firebaseapp.com",
  projectId: "decide4me-776c6",
  storageBucket: "decide4me-776c6.firebasestorage.app",
  messagingSenderId: "800765135972",
  appId: "1:800765135972:web:585a82f9dede269a16a371"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };