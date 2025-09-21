// routes/analysis.js
const express = require("express");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = (upload) => {
  const router = express.Router();

  router.post("/users/analyze", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).render('error', { 
          message: "No video uploaded.",
          details: "Please select a video file before submitting.",
          backLink: "/"
        });
      }

      const videoPath = req.file.path;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // -----------------------
      // Step 1: Fake/Real check
      // -----------------------
      const realCheckPrompt = `
        I have uploaded a video file for sports performance analysis.
        The filename is: ${req.file.originalname}
        File size: ${req.file.size} bytes
        File type: ${req.file.mimetype}
        
        Based on the filename and context, does this seem like a legitimate sports video for performance analysis?
        Please respond with either "Real" or "Fake" followed by a brief explanation of your assessment.
      `;

      const realCheckResult = await model.generateContent(realCheckPrompt);
      const realCheckResponse = await realCheckResult.response;
      const realText = realCheckResponse.text().trim();

      console.log("Real check result:", realText);

      // If video is deemed fake, redirect with error
      if (!realText.toLowerCase().includes("real")) {
        fs.unlinkSync(videoPath); // delete video after processing
        return res.render('error', {
          message: "The uploaded video seems fake or inappropriate for sports analysis. Please upload a genuine sports performance video.",
          details: realText,
          backLink: "/"
        });
      }

      // -----------------------
      // Step 2: Performance analysis
      // -----------------------
      const analysisPrompt = `
        I have uploaded a sports video for performance analysis with the following details:
        - Filename: ${req.file.originalname}
        - File size: ${req.file.size} bytes
        - File type: ${req.file.mimetype}
        
        Please provide a comprehensive sports performance analysis including:
        
        **1. Technical Skills Assessment:**
        - Key technical elements to evaluate
        - Form and technique considerations
        - Movement efficiency analysis
        
        **2. Physical Performance Indicators:**
        - Strength and power assessment
        - Cardiovascular fitness observations  
        - Flexibility and mobility factors
        - Coordination and balance evaluation
        
        **3. Mental Performance Aspects:**
        - Focus and concentration levels
        - Decision-making under pressure
        - Confidence and body language
        
        **4. Specific Improvement Areas:**
        - Top 3 priority areas for development
        - Recommended training methods
        - Skill development strategies
        
        **5. Strengths to Build Upon:**
        - Current performance strengths
        - Natural athletic abilities
        - Positive technique elements
        
        Please format your response with clear headings and actionable insights for athlete development.
      `;

      const analysisResult = await model.generateContent(analysisPrompt);
      const analysisResponse = await analysisResult.response;
      const analysisText = analysisResponse.text();

      // -----------------------
      // Delete video after analysis
      // -----------------------
      fs.unlinkSync(videoPath);

      // -----------------------
      // Render beautiful results page
      // -----------------------
      res.render('analysis-results', {
        realText: realText,
        analysisText: analysisText,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        analysisDate: new Date(),
        title: "Sports Performance Analysis Results"
      });

    } catch (err) {
      console.error("Analysis error:", err);
      
      // Clean up file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).render('error', {
        message: "Error in analyzing video",
        details: err.message,
        backLink: "/"
      });
    }
  });

  return router;
};