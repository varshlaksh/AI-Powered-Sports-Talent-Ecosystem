const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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
      // Agar validation error hai, form wapas render karo
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

      res.render("login", { errors: [] })
      // ya redirect bhi kar sakte ho:
      // res.redirect("/login");

    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);
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

      // ✅ Save user in session
      req.session.user = {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        sport: user.sport
      };

      res.redirect("/users"); // redirect to home/dashboard
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);
postRoutes.post("/performance", async (req, res) => {
  try {
    if (!req.session.user) {
      console.log("Session user not found:", req.session.user);
      return res.redirect("/users/login");
    }

    // Make sure user.id exists
    const userId = req.session.user.id;
    if (!userId) {
      console.error("User ID not found in session");
      return res.status(400).send("User session invalid.");
    }

    // Save performance
    const perf = new Performance({
      user: userId,
      height: req.body.height,
      weight: req.body.weight,
      speed: req.body.speed,
      stamina: req.body.stamina,
      accuracy: req.body.accuracy,
    });

    await perf.save();

    // Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze the following athlete performance data:
      Height: ${perf.height} cm
      Weight: ${perf.weight} kg
      Speed: ${perf.speed}
      Stamina: ${perf.stamina}
      Accuracy: ${perf.accuracy}

      Give a detailed performance analysis, strengths, weaknesses, and improvement suggestions.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.render("performance", { user: req.session.user, analysis });
  } catch (err) {
    console.error("Error in /performance POST:", err);
    res.status(500).send("Error while saving performance and analyzing.");
  }
});

module.exports = postRoutes;
