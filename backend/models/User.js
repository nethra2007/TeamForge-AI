const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const projectSubSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  techStack: [{ type: String }]
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  college: { type: String, default: 'Engineering Institute' },
  branch: { type: String, default: 'Computer Science' },
  year: { type: String, default: 'Final Year' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  preferredRole: { type: String, default: 'Full Stack Engineer' },
  preferredDomains: [{ type: String }],
  experience: { type: String, default: 'Intermediate (1-2 years hands-on)' },
  projects: [projectSubSchema],
  targetCareer: { type: String, default: 'Software Development Engineer' },
  targetCompany: { type: String, default: 'Product Tech Companies' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  readinessScore: { type: Number, default: 80 }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
