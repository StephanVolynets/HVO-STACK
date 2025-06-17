import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "@firebase/firestore";

import { FIREBASE_API } from "src/config-global";
// console.log("Initializing api:", FIREBASE_API);
export const firebaseApp = initializeApp(FIREBASE_API);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
// export const db = getFirestore(firebaseApp);

export default firebaseApp;
