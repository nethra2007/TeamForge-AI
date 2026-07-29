const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { formatSuccessResponse } = require('../utils/responseFormatter');

// @desc Update Student Profile
// @route PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      branch,
      year,
      bio,
      skills,
      interests,
      preferredRole,
      targetCareer,
      targetCompany,
      githubUrl,
      linkedinUrl,
      resumeText
    } = req.body;

    let updatedUser;

    if (getDBStatus()) {
      const user = await User.findById(req.user._id);

      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      if (name) user.name = name;
      if (college !== undefined) user.college = college;
      if (branch !== undefined) user.branch = branch;
      if (year !== undefined) user.year = year;
      if (bio !== undefined) user.bio = bio;
      if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      if (interests !== undefined) user.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim());
      if (preferredRole !== undefined) user.preferredRole = preferredRole;
      if (targetCareer !== undefined) user.targetCareer = targetCareer;
      if (targetCompany !== undefined) user.targetCompany = targetCompany;
      if (githubUrl !== undefined) user.githubUrl = githubUrl;
      if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
      if (resumeText !== undefined) user.resumeText = resumeText;

      updatedUser = await user.save();
    } else {
      updatedUser = {
        ...req.user,
        name: name || req.user.name,
        college: college !== undefined ? college : req.user.college,
        branch: branch !== undefined ? branch : req.user.branch,
        year: year !== undefined ? year : req.user.year,
        bio: bio !== undefined ? bio : req.user.bio,
        skills: skills !== undefined ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : req.user.skills,
        interests: interests !== undefined ? (Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim())) : req.user.interests,
        preferredRole: preferredRole || req.user.preferredRole,
        targetCareer: targetCareer || req.user.targetCareer,
        targetCompany: targetCompany || req.user.targetCompany,
        githubUrl: githubUrl !== undefined ? githubUrl : req.user.githubUrl,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : req.user.linkedinUrl,
        resumeText: resumeText !== undefined ? resumeText : req.user.resumeText
      };
    }

    return res.status(200).json(formatSuccessResponse(updatedUser, 'Student profile updated successfully'));

  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile
};
