import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9U3h-e-wQvxdYMidS3PhET67J2UEBDwI",
  authDomain: "cert3-c7f96.firebaseapp.com",
  projectId: "cert3-c7f96",
  storageBucket: "cert3-c7f96.firebasestorage.app",
  messagingSenderId: "792008001046",
  appId: "1:792008001046:web:492681f335225e4d1d5737"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
})