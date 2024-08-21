
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// La tua configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBO-pAPfO3K_JsaGnsctk1UlVDVs-Wpbhw",
  authDomain: "travel-app-3b7e1.firebaseapp.com",
  projectId: "travel-app-3b7e1",
  storageBucket: "travel-app-3b7e1.appspot.com",
  messagingSenderId: "876338370277",
  appId: "1:876338370277:web:9602aac245eab06fb9e60c"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
