const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('../seedbasket-342ca-firebase-adminsdk-fbsvc-c4b2196adc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'seedbasket-342ca',
  storageBucket: 'seedbasket-342ca.firebasestorage.app'
});

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

module.exports = {
  admin,
  auth,
  firestore,
  storage
};