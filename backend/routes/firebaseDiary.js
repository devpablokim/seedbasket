const express = require('express');
const router = express.Router();
const firebaseData = require('../services/firebaseDataService');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');

// Get diary entries
router.get('/entries', verifyFirebaseToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.firebaseUser.uid;
    
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const entries = await firebaseData.getDiaryEntries(userId, filters);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
});

// Create new diary entry
router.post('/entries', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const entryId = await firebaseData.saveDiaryEntry(userId, req.body);
    
    res.status(201).json({ 
      id: entryId,
      message: 'Diary entry created successfully' 
    });
  } catch (error) {
    console.error('Error creating diary entry:', error);
    res.status(500).json({ error: 'Failed to create diary entry' });
  }
});

// Update diary entry
router.put('/entries/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const entryId = req.params.id;
    
    await firebaseData.updateDiaryEntry(userId, entryId, req.body);
    res.json({ message: 'Diary entry updated successfully' });
  } catch (error) {
    console.error('Error updating diary entry:', error);
    res.status(500).json({ error: 'Failed to update diary entry' });
  }
});

// Delete diary entry
router.delete('/entries/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const entryId = req.params.id;
    
    await firebaseData.deleteDiaryEntry(userId, entryId);
    res.json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    res.status(500).json({ error: 'Failed to delete diary entry' });
  }
});

module.exports = router;