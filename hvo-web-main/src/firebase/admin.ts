// "use server";

// import { getUser } from "@/apis/user";
// import { App, cert, getApp, initializeApp } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { getStorage } from "firebase-admin/storage";
// import { readFile } from "fs/promises";
// import { get } from "lodash";
// import { getCookies } from "next-client-cookies/server";

// const init = async () => {
//   const env = process.env.NEXT_PUBLIC_APP_ENV;
//   const projectId = process.env.FIREBASE_PROJECT_ID;
//   const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

//   const privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64 as string, "base64")
//     .toString("utf8")
//     .replace(/\\n/g, "\n");

//   const credential =
//     env === "local"
//       ? cert(JSON.parse(await readFile("service-account.json", "utf8")))
//       : cert({
//           projectId,
//           privateKey,
//           clientEmail,
//         });

//   const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
//   return initializeApp({ credential, ...(storageBucket && { storageBucket }) });
// };

// export const initFirebaseAdminApp = async (): Promise<App> => {
//   let app: App | null = null;
//   try {
//     app = getApp();
//     if (!app) {
//       app = await init();
//     }
//   } catch (err) {
//     app = await init();
//   }

//   return app;
// };

// export const getBucket = () => {
//   const storage = getStorage();
//   return storage.bucket();
// };

// export const prefetchUser = async () => {
//   const cookies = getCookies().get("__session") || "{}";

//   const token = JSON.parse(cookies)?.idToken;
//   if (!token) {
//     return null;
//   }

//   await initFirebaseAdminApp();
//   const auth = getAuth();

//   const decoded = await auth.verifyIdToken(token);
//   if (!decoded) {
//     return null;
//   }

//   const user = await getUser(decoded.uid, {
//     headers: { authorization: `Bearer ${token}` },
//   });

//   return user;
// };

// export const getHeaders = async () => {
//   // const token = getCookies().get("__idToken");
//   const cookies = getCookies().get("__session") || "{}";
//   const token = JSON.parse(cookies)?.idToken;

//   if (!token) {
//     return {};
//   }

//   await initFirebaseAdminApp();
//   const auth = getAuth();

//   const decoded = await auth.verifyIdToken(token);
//   if (!decoded) {
//     return {};
//   }

//   return { authorization: `Bearer ${token}` };
// };
