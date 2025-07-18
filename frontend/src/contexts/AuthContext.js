import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import api from '../utils/api';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get the ID token
          const token = await firebaseUser.getIdToken();
          
          // Token is automatically handled by the api instance
          // The api interceptor will get it from localStorage
          
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          // Set user state
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userData.name || '',
            ...userData
          });
          
          // Store in localStorage for quick access
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userData.name || ''
          }));
        } else {
          setUser(null);
          // Token removal is handled by localStorage clear
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get token for backend
      const token = await firebaseUser.getIdToken();
      
      // Sync with backend (optional - currently disabled)
      // The /auth/firebase-login endpoint doesn't exist yet
      // This would be used for additional backend user management
      /*
      try {
        await api.post('/auth/firebase-login', {
          uid: firebaseUser.uid,
          token: token
        });
      } catch (backendError) {
        console.log('Backend sync optional:', backendError);
      }
      */
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Get token for backend
      const token = await firebaseUser.getIdToken();
      
      // Register with backend (optional - for MySQL data migration)
      try {
        await api.post('/auth/firebase-register', {
          uid: firebaseUser.uid,
          email: email,
          name: name,
          token: token
        });
      } catch (backendError) {
        console.log('Backend registration optional:', backendError);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google login...');
      console.log('Auth configured:', !!auth);
      console.log('Provider configured:', !!googleProvider);
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log('Google auth successful:', firebaseUser.email);
      
      try {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (!userDoc.exists()) {
          // Create new user document
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provider: 'google'
          });
        }
      } catch (firestoreError) {
        console.error('Firestore operation failed (non-fatal):', firestoreError);
        // Continue even if Firestore fails
      }
      
      // Get token for backend
      const token = await firebaseUser.getIdToken();
      
      // Sync with backend (optional - currently disabled)
      // The /auth/firebase-login endpoint doesn't exist yet
      // This would be used for additional backend user management
      /*
      try {
        await api.post('/auth/firebase-login', {
          uid: firebaseUser.uid,
          token: token
        });
      } catch (backendError) {
        console.log('Backend sync optional:', backendError);
      }
      */
      
      return { success: true };
    } catch (error) {
      console.error('Google login error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      return { 
        success: false, 
        error: error.message || 'Google login failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};