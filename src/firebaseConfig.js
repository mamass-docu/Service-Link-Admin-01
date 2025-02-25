import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA6pEnOVqfc7stVEbf_Uy019KGJT7ud2fI",
    authDomain: "servicelink-68ab2.firebaseapp.com",
    projectId: "servicelink-68ab2",
    storageBucket: "servicelink-68ab2.appspot.com",
    messagingSenderId: "769499811398",
    appId: "1:769499811398:web:7b7544e9f75cfa00f44447"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
