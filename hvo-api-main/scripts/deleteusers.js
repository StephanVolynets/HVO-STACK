const admin = require("firebase-admin");

// Replace with the path to your service account key JSON
const serviceAccount = require("../service-account-dev.json");

// Emails you want to keep
const keepEmails = ["vendor@hvo.com", "admin@hvo.com"];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function deleteUsersExcept() {
  let nextPageToken = undefined;

  do {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const usersToDelete = listUsersResult.users
      .filter((userRecord) => !keepEmails.includes(userRecord.email))
      .map((userRecord) => userRecord.uid);

    if (usersToDelete.length > 0) {
      const result = await admin.auth().deleteUsers(usersToDelete);
      console.log(`Deleted ${result.successCount} users, ${result.failureCount} failed`);
    }

    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
}

deleteUsersExcept()
  .then(() => console.log("Deletion complete"))
  .catch((error) => console.error("Error deleting users:", error));
