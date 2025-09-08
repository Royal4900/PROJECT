const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  gpa: { type: String },
  description: { type: String }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  achievements: [String]
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  category: { type: String, default: 'Technical' }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  link: { type: String },
  github: { type: String },
  startDate: { type: Date },
  endDate: { type: Date }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    summary: { type: String, maxlength: 500 }
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: Date, required: true },
    link: { type: String }
  }],
  languages: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Basic', 'Conversational', 'Fluent', 'Native'], default: 'Conversational' }
  }],
  template: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal'],
    default: 'modern'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ isPublic: 1, lastModified: -1 });

// Method to get formatted resume data
resumeSchema.methods.getFormattedData = function() {
  const resume = this.toObject();
  
  // Format dates
  if (resume.education) {
    resume.education.forEach(edu => {
      if (edu.startDate) edu.startDate = edu.startDate.toLocaleDateString();
      if (edu.endDate) edu.endDate = edu.endDate.toLocaleDateString();
    });
  }
  
  if (resume.experience) {
    resume.experience.forEach(exp => {
      if (exp.startDate) exp.startDate = exp.startDate.toLocaleDateString();
      if (exp.endDate) exp.endDate = exp.endDate.toLocaleDateString();
    });
  }
  
  if (resume.certifications) {
    resume.certifications.forEach(cert => {
      if (cert.date) cert.date = cert.date.toLocaleDateString();
    });
  }
  
  return resume;
};

module.exports = mongoose.model('Resume', resumeSchema);
