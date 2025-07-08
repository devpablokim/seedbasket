const express = require('express');
const router = express.Router();
const { DiaryEntry, MarketData } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

router.post('/entries', protect, async (req, res) => {
  try {
    const { date, portfolioValue, emotion, notes, selectedETFs, selectedNews } = req.body;

    const marketSnapshot = await MarketData.findAll({
      attributes: ['symbol', 'name', 'type', 'price', 'changePercent'],
      order: [['marketCap', 'DESC']]
    });

    const entry = await DiaryEntry.create({
      userId: req.user.id,
      date,
      portfolioValue,
      emotion,
      notes,
      marketSnapshot: marketSnapshot,
      selectedETFs: selectedETFs || [],
      selectedNews: selectedNews || []
    });

    res.status(201).json(entry);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Entry for this date already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.get('/entries', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const entries = await DiaryEntry.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/entries/:date', protect, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({
      where: {
        userId: req.user.id,
        date: req.params.date
      }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/entries/:date', protect, async (req, res) => {
  try {
    const { portfolioValue, emotion, notes, selectedETFs, selectedNews } = req.body;

    const [updated] = await DiaryEntry.update(
      { portfolioValue, emotion, notes, selectedETFs, selectedNews },
      {
        where: {
          userId: req.user.id,
          date: req.params.date
        }
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const entry = await DiaryEntry.findOne({
      where: {
        userId: req.user.id,
        date: req.params.date
      }
    });

    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;