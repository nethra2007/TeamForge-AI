const express = require('express');
const router = express.Router();
const { getTeams, createTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTeams);
router.post('/', protect, createTeam);

module.exports = router;
