const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teamforge_ai_super_secret_jwt_key_2026_production');

      if (getDBStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback demo user when database is in memory mode
        req.user = {
          _id: decoded.id || '650000000000000000000001',
          name: decoded.name || 'Alex Morgan',
          email: decoded.email || 'alex.morgan@stanford.edu',
          college: 'Stanford University',
          branch: 'Computer Science & AI',
          year: 'Final Year',
          skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'Tailwind CSS', 'Docker'],
          interests: ['Autonomous AI Agents', 'Full Stack Development', 'LLMs', 'Hackathons'],
          preferredRole: 'Full Stack & AI Engineer',
          targetCareer: 'Senior AI Engineer',
          targetCompany: 'Google DeepMind / OpenAI',
          readinessScore: 88
        };
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found',
          errorCode: 'UNAUTHORIZED'
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        errorCode: 'INVALID_TOKEN'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      errorCode: 'NO_TOKEN'
    });
  }
};

module.exports = { protect };
