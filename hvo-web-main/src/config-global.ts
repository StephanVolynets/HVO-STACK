import { paths } from "src/routes/paths";

// API
// ----------------------------------------------------------------------

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

function getFirebaseConfig(): FirebaseConfig {
  // First, check if we're in App Hosting environment
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    // If we have the JSON configuration from App Hosting, use it
    try {
      return JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    } catch (error) {
      console.error("Failed to parse Firebase configuration:", error);
      throw new Error("Invalid Firebase configuration");
    }
  }

  // If we're in development, use individual environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!, // Note: matches your variable name
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

// export const FIREBASE_API = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// console.log(" [###] Firebase Config:", process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
// console.log(" [###] App Type:", process.env.NEXT_PUBLIC_APP_TYPE);
// console.log(" [###]  Appi endpoint:", process.env.NEXT_PUBLIC_API_ENDPOINT);

export const FIREBASE_API = getFirebaseConfig();

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;
