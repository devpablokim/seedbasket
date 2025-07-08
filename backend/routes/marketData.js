const express = require('express');
const router = express.Router();
const { MarketData, MarketDataHistory } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/etfs', protect, async (req, res) => {
  try {
    const etfs = await MarketData.findAll({
      where: { type: 'ETF' },
      order: [['marketCap', 'DESC']],
      limit: 20
    });

    res.json(etfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/commodities', protect, async (req, res) => {
  try {
    const commodities = await MarketData.findAll({
      where: { type: 'COMMODITY' }
    });

    res.json(commodities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const [etfs, commodities] = await Promise.all([
      MarketData.findAll({
        where: { type: 'ETF' },
        order: [['marketCap', 'DESC']],
        limit: 20
      }),
      MarketData.findAll({
        where: { type: 'COMMODITY' }
      })
    ]);

    res.json({
      etfs,
      commodities,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical data for a specific symbol
router.get('/history/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const history = await MarketDataHistory.findAll({
      where: {
        symbol: symbol,
        recordedAt: {
          [Op.gte]: startDate
        }
      },
      order: [['recordedAt', 'ASC']]
    });
    
    res.json({
      symbol,
      period,
      data: history
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical snapshot for a specific date
router.get('/snapshot/:date', protect, async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const snapshot = await MarketDataHistory.findAll({
      where: {
        recordedAt: {
          [Op.gte]: targetDate,
          [Op.lt]: nextDay
        }
      },
      order: [['recordedAt', 'DESC']],
      limit: 1,
      raw: true
    });
    
    // Group by symbol to get latest record for each symbol on that date
    const symbolMap = {};
    snapshot.forEach(record => {
      if (!symbolMap[record.symbol] || new Date(record.recordedAt) > new Date(symbolMap[record.symbol].recordedAt)) {
        symbolMap[record.symbol] = record;
      }
    });
    
    res.json({
      date: date,
      data: Object.values(symbolMap)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;