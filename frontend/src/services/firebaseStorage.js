import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload file to Firebase Storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload user profile image
export const uploadProfileImage = async (userId, file) => {
  const path = `users/${userId}/profile/${Date.now()}_${file.name}`;
  return uploadFile(file, path);
};

// Upload diary attachment
export const uploadDiaryAttachment = async (userId, diaryId, file) => {
  const path = `users/${userId}/diary/${diaryId}/${Date.now()}_${file.name}`;
  return uploadFile(file, path);
};

// Delete file from Firebase Storage
export const deleteFile = async (fileUrl) => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file URL (if you have the path)
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};