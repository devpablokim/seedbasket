const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Verify Firebase token middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Token verification endpoint
router.post('/verify', verifyToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      uid: req.user.uid,
      email: req.user.email
    }
  });
});

module.exports = router;