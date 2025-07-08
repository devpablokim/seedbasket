const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/', protect, async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }

    const news = await News.findAll({
      where: whereClause,
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    // 주말에는 뉴스가 적으므로 7일 전까지의 뉴스를 가져옴 (최소 5개 보장)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let news = await News.findAll({
      where: {
        publishedAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      order: [['publishedAt', 'DESC']],
      limit: 20
    });

    // 만약 뉴스가 5개 미만이면 더 오래된 뉴스도 가져옴
    if (news.length < 5) {
      news = await News.findAll({
        order: [['publishedAt', 'DESC']],
        limit: 20
      });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;