var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sih2020-dc9d8.firebaseio.com"
});
// admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
