const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const Analysis = require('../models/Analysis');
const User = require('../models/User');

// Load skills dataset
const skillsPath = path.join(__dirname, '../skills.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
const ALL_SKILLS = skillsData.skills.map(skill => skill.toLowerCase());

/**
 * Extracts predefined skills from any given text.
 * @param {string} text - The input text to parse.
 * @returns {Array} - Array of extracted skills.
 */
const extractSkills = (text) => {
  const extracted = new Set();
  const lowerText = text.toLowerCase();
  
  // Use regex for boundaries to avoid matching substrings (e.g. matching "c" inside "react")
  // For skills with specific characters like C++, we need careful escaping, but simple JS include might suffice for most.
  // Using direct includes with boundary check where possible.
  ALL_SKILLS.forEach(skill => {
    // Need to escape regex special characters
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    
    // Some skills like C++ or .NET don't play well with \b word boundaries
    if (skill === 'c++' || skill === 'c#') {
      if (lowerText.includes(skill)) extracted.add(skill);
    } else {
      if (regex.test(lowerText)) {
        extracted.add(skill);
      }
    }
  });

  // Restore original casing for extracted skills
  const formattedSkills = skillsData.skills.filter(s => extracted.has(s.toLowerCase()));
  return Array.from(formattedSkills);
};

// 1. Resume Upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let resumeText = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: req.file.buffer });
      const pdfData = await parser.getText();
      resumeText = pdfData.text;
      await parser.destroy();
    } else if (req.file.mimetype === 'text/plain') {
      resumeText = req.file.buffer.toString('utf8');
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or Text file.' });
    }

    res.json({ message: 'Resume uploaded successfully', resumeText });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: `Failed to process resume: ${error.message || 'Unknown error'}` });
  }
};

// 2. Analyze Resume
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required for analysis.' });
    }

    const extractedSkills = extractSkills(resumeText);
    res.json({ message: 'Skills extracted successfully', skills: extractedSkills });
  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

// 3. Match Job
exports.matchJob = async (req, res) => {
  try {
    const { resumeText, jobDescription, userName, userEmail } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and Job description are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
      Act as an expert technical recruiter and resume reviewer. 
      You will be provided with a Candidate's extracted Resume Text and a Target Job Description.
      Perform a comprehensive, holistic semantic analysis comparing the candidate's qualifications, experience, and educational background against the core requirements of the role.

      RESUME START
      ${resumeText}
      RESUME END

      JOB DESCRIPTION START
      ${jobDescription}
      JOB DESCRIPTION END
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: "OBJECT",
          properties: {
            matchScore: {
              type: "INTEGER",
              description: "A number between 0 and 100 representing the holistic compatibility of the resume with the job description."
            },
            matchedSkills: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "A list of relevant skills, tools, or concepts the candidate possesses that align with the job."
            },
            missingSkills: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "A list of critical or highly requested skills from the job description that do not appear to be present or strong in the resume."
            },
            strengths: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "2-4 sentences detailing the key reasons why this candidate is a strong fit for the role based on their experience."
            },
            weaknesses: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "2-4 sentences detailing areas of concern, missing experience, or where the candidate might fall short of the requirements."
            },
            recommendations: {
               type: "ARRAY",
               items: { type: "STRING" },
               description: "Actionable, specific advice for the candidate on how to improve their resume or what to highlight in an interview for this specific role."
            }
          },
          required: ["matchScore", "matchedSkills", "missingSkills", "strengths", "weaknesses", "recommendations"]
        }
      }
    });

    const analysisResult = JSON.parse(response.text);

    // Save to DB
    let user = null;
    if (userName || userEmail) {
      user = new User({
        name: userName || 'Anonymous',
        email: userEmail || 'Not Provided',
        resumeText: resumeText
      });
      await user.save();
    }

    const analysisRecord = new Analysis({
      userId: user ? user._id : null,
      resumeSkills: analysisResult.matchedSkills, // we map matched to resumeSkills for backward compat DB structure
      jobSkills: [...analysisResult.matchedSkills, ...analysisResult.missingSkills],
      matchScore: analysisResult.matchScore,
      missingSkills: analysisResult.missingSkills,
      // Note: strengths, weaknesses, and recommendations aren't currently saved to MongoDB, 
      // but they are returned to the frontend.
    });
    
    // Catch db errors quietly so they don't break response if string connect fails
    try { await analysisRecord.save(); } catch (e) { console.log('DB Save Warning:', e.message); }

    res.json(analysisResult);

  } catch (error) {
    console.error('Match Error:', error);
    res.status(500).json({ error: 'Failed to analyze job match via AI' });
  }
};
