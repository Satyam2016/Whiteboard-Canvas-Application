
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 

// Initialize Firebase Admin SDK with credentials
if (!admin.apps.length) {
     admin.initializeApp({
         credential: admin.credential.cert(serviceAccount),
     });
 }
 

const db = admin.firestore();
module.exports = { db };
