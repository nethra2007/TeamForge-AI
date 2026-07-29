const express = require('express');
const router = express.Router();
const { getAgentHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAgentHistory);

module.exports = router;
