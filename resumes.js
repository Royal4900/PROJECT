const express = require('express');
const PDFDocument = require('pdfkit');
const Resume = require('../models/Resume');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all resumes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ lastModified: -1 })
      .select('title personalInfo template isPublic lastModified createdAt');

    res.json({
      success: true,
      data: resumes
    });
  } catch (error) {
    console.error('Fetch resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: error.message
    });
  }
});

// Get a specific resume by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Fetch resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message
    });
  }
});

// Create a new resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id,
      personalInfo: {
        ...req.body.personalInfo,
        firstName: req.body.personalInfo?.firstName || req.user.firstName,
        lastName: req.body.personalInfo?.lastName || req.user.lastName,
        email: req.body.personalInfo?.email || req.user.email
      }
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resume',
      error: error.message
    });
  }
});

// Update an existing resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        ...req.body,
        lastModified: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: error.message
    });
  }
});

// Delete a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
});

// Duplicate a resume
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const duplicatedResume = new Resume({
      ...originalResume.toObject(),
      _id: undefined,
      title: `${originalResume.title} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date()
    });

    await duplicatedResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: duplicatedResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate resume',
      error: error.message
    });
  }
});

// Generate PDF for a resume
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'resume'}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Generate PDF content based on template
    generatePDFContent(doc, resume);

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
});

// Function to generate PDF content
function generatePDFContent(doc, resume) {
  const { personalInfo, education, experience, skills, projects, certifications, languages } = resume;

  // Header
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text(`${personalInfo.firstName} ${personalInfo.lastName}`, { align: 'center' });
  
  doc.moveDown(0.5);
  
  // Contact info
  doc.fontSize(12)
     .font('Helvetica')
     .text(personalInfo.email, { align: 'center' });
  
  if (personalInfo.phone) {
    doc.text(personalInfo.phone, { align: 'center' });
  }
  
  if (personalInfo.address) {
    doc.text(`${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state}`, { align: 'center' });
  }

  doc.moveDown(1);

  // Summary
  if (personalInfo.summary) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Professional Summary');
    
    doc.fontSize(11)
       .font('Helvetica')
       .text(personalInfo.summary);
    
    doc.moveDown(1);
  }

  // Experience
  if (experience && experience.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Professional Experience');
    
    doc.moveDown(0.5);

    experience.forEach(exp => {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`${exp.position} at ${exp.company}`);
      
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      
      doc.fontSize(11)
         .font('Helvetica')
         .text(exp.description);
      
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          doc.fontSize(10)
             .text(`• ${achievement}`);
        });
      }
      
      doc.moveDown(0.5);
    });
  }

  // Education
  if (education && education.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Education');
    
    doc.moveDown(0.5);

    education.forEach(edu => {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`${edu.degree} in ${edu.field}`);
      
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .text(`${edu.institution} - ${edu.startDate} - ${edu.endDate || 'Present'}`);
      
      if (edu.gpa) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(`GPA: ${edu.gpa}`);
      }
      
      doc.moveDown(0.5);
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Skills');
    
    doc.moveDown(0.5);

    const skillText = skills.map(skill => `${skill.name} (${skill.level})`).join(', ');
    doc.fontSize(11)
       .font('Helvetica')
       .text(skillText);
    
    doc.moveDown(1);
  }

  // Projects
  if (projects && projects.length > 0) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Projects');
    
    doc.moveDown(0.5);

    projects.forEach(project => {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(project.name);
      
      doc.fontSize(11)
         .font('Helvetica')
         .text(project.description);
      
      if (project.technologies && project.technologies.length > 0) {
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .text(`Technologies: ${project.technologies.join(', ')}`);
      }
      
      doc.moveDown(0.5);
    });
  }
}

module.exports = router;
