const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ChatMessage } = require('../models');
const { generateAIResponse } = require('../services/aiService');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get user's conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    // Get all user messages
    const conversations = await ChatMessage.findAll({
      where: { 
        userId: req.user.id,
        role: 'user' 
      },
      attributes: ['conversationId', 'message', 'timestamp'],
      order: [['timestamp', 'DESC']],
      raw: true
    });

    // Group by conversationId and get the latest message for each
    const conversationMap = new Map();
    
    conversations.forEach(conv => {
      if (!conversationMap.has(conv.conversationId)) {
        conversationMap.set(conv.conversationId, {
          id: conv.conversationId,
          preview: conv.message.length > 50 ? conv.message.substring(0, 50) + '...' : conv.message,
          timestamp: conv.timestamp
        });
      }
    });

    // Convert to array and sort by timestamp
    const uniqueConversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(uniqueConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId', protect, async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: {
        userId: req.user.id,
        conversationId: req.params.conversationId
      },
      order: [['timestamp', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message and get AI response
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, conversationId, language } = req.body;
    const convId = conversationId || uuidv4();

    // Save user message
    const userMessage = await ChatMessage.create({
      userId: req.user.id,
      conversationId: convId,
      role: 'user',
      message
    });

    // Get conversation history (last 10 messages)
    const history = await ChatMessage.findAll({
      where: {
        userId: req.user.id,
        conversationId: convId
      },
      order: [['timestamp', 'DESC']],
      limit: 10,
      raw: true
    });

    // Reverse to get chronological order
    const conversationHistory = history.reverse();

    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversationHistory, language);

    // Save AI response
    const assistantMessage = await ChatMessage.create({
      userId: req.user.id,
      conversationId: convId,
      role: 'assistant',
      message: aiResponse
    });

    res.json({
      conversationId: convId,
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Delete a conversation
router.delete('/conversations/:conversationId', protect, async (req, res) => {
  try {
    await ChatMessage.destroy({
      where: {
        userId: req.user.id,
        conversationId: req.params.conversationId
      }
    });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;