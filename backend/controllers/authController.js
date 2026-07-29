const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { formatSuccessResponse } = require('../utils/responseFormatter');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || '650000000000000000000001', email: user.email, name: user.name },
    process.env.JWT_SECRET || 'teamforge_ai_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, branch, year } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    let user;

    if (getDBStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email');
      }

      user = await User.create({
        name,
        email,
        password,
        college: college || '',
        branch: branch || '',
        year: year || '',
        skills: [],
        interests: [],
        preferredRole: '',
        targetCareer: '',
        targetCompany: ''
      });
    } else {
      user = {
        _id: '650000000000000000000001',
        name,
        email,
        college: college || '',
        branch: branch || '',
        year: year || '',
        skills: [],
        interests: [],
        preferredRole: '',
        targetCareer: '',
        targetCompany: '',
        readinessScore: 0
      };
    }

    const token = generateToken(user);

    return res.status(201).json(formatSuccessResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      branch: user.branch,
      year: user.year,
      skills: user.skills,
      interests: user.interests,
      preferredRole: user.preferredRole,
      targetCareer: user.targetCareer,
      targetCompany: user.targetCompany,
      readinessScore: user.readinessScore || 80,
      token
    }, 'User registered successfully'));

  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    let user;

    if (getDBStatus()) {
      user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } else {
      // Mock mode fallback - use the requesting user's email-derived identity
      user = {
        _id: '650000000000000000000001',
        name: email.split('@')[0].split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' '),
        email,
        college: '',
        branch: '',
        year: '',
        skills: [],
        interests: [],
        preferredRole: '',
        targetCareer: '',
        targetCompany: '',
        readinessScore: 0
      };
    }

    const token = generateToken(user);

    return res.status(200).json(formatSuccessResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      branch: user.branch,
      year: user.year,
      skills: user.skills,
      interests: user.interests,
      preferredRole: user.preferredRole,
      targetCareer: user.targetCareer,
      targetCompany: user.targetCompany,
      readinessScore: user.readinessScore || 85,
      token
    }, 'User logged in successfully'));

  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json(formatSuccessResponse(req.user, 'Current user profile fetched'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
