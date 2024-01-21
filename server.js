const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

// Simulated users
const users = [
  { username: "Waatsal", password: "2504", role: "admin" },
  { username: "Devansh", password: "2603", role: "user" },
];

// Routes

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Login Route - GET
app.get("/login", (req, res) => {
  res.render("login");
});

// Login Route - POST
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const userFound = users.find((user) => {
    return user.username === username && user.password === password;
  });

  //Cookie Configuration
  res.cookie("userData", JSON.stringify(userFound), {
    maxAge: 3 * 24 * 60 * 1000, //3 days expiration
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  if (userFound) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: "Invalid username or password!" });
  }
});

// Dashboard Route
app.get("/dashboard", (req, res) => {
  const userData = req.cookies.userData
    ? JSON.parse(req.cookies.userData)
    : null;
  const username = userData ? userData.username : null;
  if (username) {
    res.render("dashboard", { username });
  }
});

// Logout Route (if needed)
app.get("/logout", (req, res) => {
  //clear cookie
  res.clearCookie("userData");
  // Perform logout operations if necessary
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
