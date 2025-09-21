const express = require("express");
const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.render("index", { user: req.session.user || null });
});

userRoutes.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});
userRoutes.get("/login", (req, res) => {
    res.render("login", { errors: [] });
});
userRoutes.get("/dashboad",(req,res)=>{
    res.render("dashboad");
})
userRoutes.get("/leaderboad",(req,res)=>{
    res.render("leaderboad");
})
userRoutes.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }

  // Session me stored user ka object pass kar rahe
  const sessionUser = req.session.user;

  res.render("profile", { user: sessionUser });
});

userRoutes.get("/upload",(req,res)=>{
    res.render("upload",{
      realText: null,
    user: req.session.user || null,
    videoPath: null,
    analysisResults: null
    });
})
userRoutes.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/users/login");
  });
});



module.exports = userRoutes;