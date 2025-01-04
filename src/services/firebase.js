import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

// Konfigurasi Firebase dari Console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsIo1WptXjZkovsus34J3PfIc4OyH9SXQ",
    authDomain: "aidil-project-105f4.firebaseapp.com",
    databaseURL: "https://aidil-project-105f4-default-rtdb.firebaseio.com",
    projectId: "aidil-project-105f4",
    storageBucket: "aidil-project-105f4.firebasestorage.app",
    messagingSenderId: "716989272478",
    appId: "1:716989272478:web:4c4f62429bbcffd277468f"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, database };
