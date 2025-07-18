// Environment-based Firebase configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Dynamically import the correct configuration
let firebaseModule;
if (isDevelopment) {
  firebaseModule = require('./firebase.dev');
} else {
  firebaseModule = require('./firebase.prod');
}

export const analytics = firebaseModule.analytics;
export const auth = firebaseModule.auth;
export const db = firebaseModule.db;
export const storage = firebaseModule.storage;
export const googleProvider = firebaseModule.googleProvider;

export default firebaseModule.default;