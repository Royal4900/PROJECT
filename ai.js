const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get AI suggestions for resume improvement
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { resumeData, section, specificQuestion } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    let prompt = '';
    
    if (specificQuestion) {
      // Answer specific question about the resume
      prompt = `As a professional resume writer and career coach, please help with this specific question about a resume: "${specificQuestion}"

Resume Information:
${JSON.stringify(resumeData, null, 2)}

Please provide a detailed, actionable response that would help improve this resume.`;
    } else if (section) {
      // Provide suggestions for a specific section
      const sectionData = resumeData[section];
      prompt = `As a professional resume writer, please analyze this ${section} section and provide specific suggestions for improvement:

${section} Section:
${JSON.stringify(sectionData, null, 2)}

Please provide:
1. 3-5 specific improvement suggestions
2. Examples of better wording or phrasing
3. Industry best practices for this section
4. Any red flags or areas of concern`;
    } else {
      // General resume review
      prompt = `As a professional resume writer and career coach, please provide a comprehensive review of this resume:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Please provide:
1. Overall strengths and weaknesses
2. Specific improvement suggestions for each section
3. Industry best practices recommendations
4. ATS (Applicant Tracking System) optimization tips
5. Professional formatting suggestions`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and career coach with 15+ years of experience. Provide practical, actionable advice that will help job seekers improve their resumes and increase their chances of getting interviews. Be specific, constructive, and encouraging."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const suggestion = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        suggestion,
        model: completion.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('AI suggestion error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        message: 'OpenAI API quota exceeded. Please try again later or upgrade your plan.',
        error: 'API quota exceeded'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key. Please check your configuration.',
        error: 'Invalid API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get AI suggestions',
      error: error.message
    });
  }
});

// Get AI-powered content suggestions for specific fields
router.post('/content-suggestions', auth, async (req, res) => {
  try {
    const { field, context, jobTitle, industry } = req.body;

    if (!field || !context) {
      return res.status(400).json({
        success: false,
        message: 'Field and context are required'
      });
    }

    let prompt = '';
    
    switch (field) {
      case 'summary':
        prompt = `Write a compelling professional summary for a resume. 

Context: ${context}
Job Title: ${jobTitle || 'Not specified'}
Industry: ${industry || 'Not specified'}

Requirements:
- 2-3 sentences maximum
- Professional and confident tone
- Highlight key achievements and skills
- Tailored to the target role
- ATS-friendly language`;
        break;
        
      case 'experience':
        prompt = `Write 2-3 compelling bullet points for a work experience entry on a resume.

Context: ${context}
Job Title: ${jobTitle || 'Not specified'}
Industry: ${industry || 'Not specified'}

Requirements:
- Start with strong action verbs
- Include quantifiable achievements when possible
- Focus on impact and results
- Use industry-specific keywords
- Keep each bullet point concise (1-2 lines)`;
        break;
        
      case 'skills':
        prompt = `Suggest relevant skills for a resume based on the context.

Context: ${context}
Job Title: ${jobTitle || 'Not specified'}
Industry: ${industry || 'Not specified'}

Please provide:
1. 5-8 technical skills
2. 3-5 soft skills
3. Industry-specific keywords
4. ATS-friendly skill descriptions`;
        break;
        
      default:
        prompt = `Provide content suggestions for the "${field}" section of a resume.

Context: ${context}
Job Title: ${jobTitle || 'Not specified'}
Industry: ${industry || 'Not specified'}

Please provide professional, compelling content that would be appropriate for this resume section.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Provide specific, actionable content suggestions that will help job seekers create compelling resume sections. Be concise, professional, and industry-appropriate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const suggestion = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        suggestion,
        field,
        model: completion.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('AI content suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content suggestions',
      error: error.message
    });
  }
});

// Get AI-powered job description analysis
router.post('/job-analysis', auth, async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }

    const prompt = `As a career coach and resume expert, please analyze this job description and provide specific recommendations for tailoring a resume to this position.

Job Description:
${jobDescription}

Resume Data (if provided):
${resumeData ? JSON.stringify(resumeData, null, 2) : 'Not provided'}

Please provide:
1. Key skills and qualifications to highlight
2. Keywords to include for ATS optimization
3. Specific achievements or experiences to emphasize
4. Areas where the resume could be improved to match this role
5. Suggested modifications for better alignment
6. Industry-specific insights`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach and resume writer. Provide specific, actionable advice for tailoring resumes to specific job descriptions. Focus on practical steps that will increase interview chances."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const analysis = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        analysis,
        model: completion.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('AI job analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze job description',
      error: error.message
    });
  }
});

module.exports = router;
