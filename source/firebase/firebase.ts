import admin from "firebase-admin";
import firebase from "firebase";
import dotenv from "dotenv";
dotenv.config();
// get firebase service account file
import firebaseAccountCredentials from "./FBSA.json";

const FirebaseServiceAccount = firebaseAccountCredentials as admin.ServiceAccount;
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(FirebaseServiceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

firebase.initializeApp(config);

export { admin, firebase, config };
