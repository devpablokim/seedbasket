const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const firebaseData = require('../services/firebaseDataService');
const { generateAIResponse } = require('../services/aiService');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');

// Get user's conversations
router.get('/conversations', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const conversations = await firebaseData.getConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const messages = await firebaseData.getChatMessages(userId, req.params.conversationId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message and get AI response
router.post('/chat', verifyFirebaseToken, async (req, res) => {
  try {
    const { message, conversationId, language } = req.body;
    const userId = req.firebaseUser.uid;
    const convId = conversationId || uuidv4();

    // Save user message
    await firebaseData.saveChatMessage(userId, convId, {
      role: 'user',
      message: message
    });

    // Get conversation history
    const history = await firebaseData.getChatMessages(userId, convId);
    const conversationHistory = history.slice(-10); // Last 10 messages

    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversationHistory, language);

    // Save AI response
    await firebaseData.saveChatMessage(userId, convId, {
      role: 'assistant',
      message: aiResponse
    });

    res.json({
      conversationId: convId,
      userMessage: { role: 'user', message },
      assistantMessage: { role: 'assistant', message: aiResponse }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Delete a conversation
router.delete('/conversations/:conversationId', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    await firebaseData.deleteConversation(userId, req.params.conversationId);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;