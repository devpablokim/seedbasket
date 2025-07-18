const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase-admin');

// Firebase user registration
router.post('/firebase-register', async (req, res) => {
  try {
    const { uid, email, name, token } = req.body;
    
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken.uid !== uid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Create or update user in Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      email,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    res.json({ 
      message: 'User registered successfully',
      userId: uid
    });
  } catch (error) {
    console.error('Firebase register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Firebase login
router.post('/firebase-login', async (req, res) => {
  try {
    const { uid, token } = req.body;
    
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken.uid !== uid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Update last login time
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      lastLogin: new Date().toISOString()
    });
    
    res.json({ 
      message: 'Login successful',
      userId: uid
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;