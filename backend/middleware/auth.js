const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../config/firebase-admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // First try to verify as Firebase token
      try {
        const decodedFirebase = await auth.verifyIdToken(token);
        // Find user by Firebase UID
        req.user = await User.findOne({
          where: { firebaseUid: decodedFirebase.uid },
          attributes: { exclude: ['password'] }
        });
        
        if (!req.user) {
          // Create a virtual user object for Firebase users not in MySQL yet
          req.user = {
            id: decodedFirebase.uid,
            email: decodedFirebase.email,
            name: decodedFirebase.name || decodedFirebase.email,
            firebaseUid: decodedFirebase.uid
          };
        }
        
        req.firebaseUser = decodedFirebase;
        return next();
      } catch (firebaseError) {
        // If Firebase verification fails, try JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
        });

        if (!req.user) {
          return res.status(401).json({ error: 'User not found' });
        }

        return next();
      }
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };