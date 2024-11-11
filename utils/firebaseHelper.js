// firebaseHelper.js
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

let firebaseApp;
let firebaseAuth;
let firebaseStorage;

export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyCenipDSL8JqKQS_RynVkwJRANDFNDQkq0",
    authDomain: "third-year-project-2c056.firebaseapp.com",
    projectId: "third-year-project-2c056",
    storageBucket: "third-year-project-2c056.appspot.com",
    messagingSenderId: "288224727682",
    appId: "1:288224727682:web:389b2d957a6fa3260eda9b",
    measurementId: "G-FD5S3YS6RC",
  };

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    firebaseStorage = getStorage(firebaseApp);
  } else {
    firebaseApp = getApp();
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
  }

  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    getFirebaseApp(); // Initialize app if not already initialized
  }
  return firebaseAuth;
};

export const getFirebaseStorage = () => {
  if (!firebaseStorage) {
    getFirebaseApp(); // Initialize app if not already initialized
  }
  return firebaseStorage;
};
