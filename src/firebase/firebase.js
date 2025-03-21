import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBOndErzcVbIpf6NWvacPQuv35rJnJ8VNs",
//   authDomain: "servicelink-d960c.firebaseapp.com",
//   projectId: "servicelink-d960c",
//   storageBucket: "servicelink-d960c.firebasestorage.app",
//   messagingSenderId: "780467063427",
//   appId: "1:780467063427:web:65e0e758052f85d0cca9b6",
//   databaseURL: "https://servicelink-d960c-default-rtdb.firebaseio.com",
// };

const firebaseConfig = {
  apiKey: "AIzaSyClDXWMCEVWQuamBLVKnQdXG1n4PlpiJFs",
  authDomain: "service-link-d7b4e.firebaseapp.com",
  projectId: "service-link-d7b4e",
  storageBucket: "service-link-d7b4e.firebasestorage.app",
  messagingSenderId: "849305888050",
  appId: "1:849305888050:web:f9e38748c2c47e22aaa32b",
  databaseURL: "https://service-link-d7b4e-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to localStorage");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { app, db, auth };
