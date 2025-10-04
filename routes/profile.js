const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Performance = require("../models/performance");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini AI with proper API key handling
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("Gemini AI initialized successfully");
} else {
  console.error("GEMINI_API_KEY not found in environment variables");
}

const postRoutes = express.Router();

// Signup POST route
postRoutes.post(
  "/signup",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("role").notEmpty().withMessage("Role is required"),
    body("sport").notEmpty().withMessage("Sport is required"),
    body("terms").equals("on").withMessage("You must accept the terms"),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array() });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .render("signup", { errors: [{ msg: "Email already registered" }] });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // Create new user
      const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        sport: req.body.sport,
      });

      await user.save();

      res.render("login", { errors: [] });

    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// Login POST route
postRoutes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", { errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .render("login", { errors: [{ msg: "Invalid email or password" }] });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .render("login", { errors: [{ msg: "Invalid email or password" }] });
      }

      // Save user in session
      req.session.user = {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        sport: user.sport
      };

      res.redirect("/users/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// Performance POST route with Gemini analysis
postRoutes.post("/performance", async (req, res) => {
  try {
    if (!req.session.user) {
      console.log("Session user not found:", req.session.user);
      return res.redirect("/users/login");
    }

    const userId = req.session.user.id;
    if (!userId) {
      console.error("User ID not found in session");
      return res.status(400).send("User session invalid.");
    }

    const { height, weight, speed, stamina, accuracy } = req.body;

    // Validate performance data
    if (!height || !weight || !speed || !stamina || !accuracy) {
      return res.status(400).render("performance", {
        user: req.session.user,
        errors: [{ msg: "All performance fields are required" }]
      });
    }

    // Save performance in database
    const perf = new Performance({
      user: userId,
      height: parseFloat(height),
      weight: parseFloat(weight),
      speed: parseFloat(speed),
      stamina: parseFloat(stamina),
      accuracy: parseFloat(accuracy),
    });

    await perf.save();
    console.log("Performance data saved successfully");

    // Check if Gemini API is available
    if (!genAI) {
      console.error("Gemini AI not initialized - API key missing");
      return res.render("analysis", { 
        analysis: "Performance analysis is currently unavailable. Please check your API configuration." 
      });
    }

    // Generate analysis using Gemini API
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
Analyze the following athlete performance data and provide detailed, actionable insights:

Physical Stats:
- Height: ${height} cm
- Weight: ${weight} kg

Performance Metrics:
- Speed: ${speed}/10
- Stamina: ${stamina}/10
- Accuracy: ${accuracy}/10

Please provide:
1. Overall performance assessment (concise and clear)
2. Key strengths (highlight top 2-3)
3. Areas for improvement (mention priority areas)
4. Specific training tips & drills (practical, short, easy-to-follow)
5. Nutrition suggestions (if relevant, short actionable tips)
6. Quick improvement hacks (1-2 lines per metric)

Format your response in a structured, easy-to-read manner, using bullet points or short paragraphs. Avoid vague statements; focus on actionable guidance.
`;


      const result = await model.generateContent(prompt);
      const analysis = result.response.text();
      
      console.log("Gemini analysis generated successfully");
      res.render("analysis", { 
        user: req.session.user, 
        analysis: analysis,
        performanceData: {
          height,
          weight,
          speed,
          stamina,
          accuracy
        }
      });

    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      
      // Provide fallback analysis if API fails
      const fallbackAnalysis = `
        Performance Data Recorded:
        - Height: ${height} cm
        - Weight: ${weight} kg  
        - Speed: ${speed}/10
        - Stamina: ${stamina}/10
        - Accuracy: ${accuracy}/10
        
        Your performance data has been saved successfully. 
        Advanced AI analysis is temporarily unavailable. 
        Please try again later or contact support.
      `;
      
      res.render("analysis", { 
        user: req.session.user, 
        analysis: fallbackAnalysis,
        error: "AI analysis temporarily unavailable"
      });
    }

  } catch (err) {
    console.error("Error in /performance POST:", err);
    res.status(500).render("error", { 
      message: "Error while saving performance data",
      error: err.message 
    });
  }
});

module.exports = postRoutes;