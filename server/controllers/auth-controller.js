const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/Database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.JWT; 

const home = (req, res) => {
  try {
    res.send('Welcome to the Auth Home Page');
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// ===========================
// REGISTER WITH JWT
// ===========================
const register = (req, res) => {
  try {
    const { username, email, phone, password, isadmin } = req.body;

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
      if (err) return res.status(500).send("Server Error");

      if (result.length > 0) {
        return res.status(400).send("User already exists");
      }

      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).send("Error hashing password");

        const insertQuery =
          "INSERT INTO users (username, email, phone, password, isadmin) VALUES (?, ?, ?, ?, ?)";

        db.query(insertQuery, [username, email, phone, hashedPassword, isadmin],
          (err2) => {
            if (err2) return res.status(500).send("Server Error");

            // ===========================
            // CREATE JWT TOKEN
            // ===========================
            const token = jwt.sign(
              { email, username, isadmin },
              SECRET_KEY,
              { expiresIn: "1h" }
            );

            return res.status(200).json({
              message: "User registered successfully",
              token: token
            });
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// ===========================
// JWT AUTH MIDDLEWARE
// ===========================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer token"

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // store decoded data
    next();
  });
};

// ===========================
// PROTECTED ROUTE EXAMPLE
// ===========================
const dashboard = (req, res) => {
  res.json({
    message: "Welcome to Dashboard",
    user: req.user
  });
};

// ===========================
// LOGIN WITH JWT
// ===========================
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Server Error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Error checking password" });

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            isadmin: user.isadmin
          },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          message: "Login successful",
          token: token,
          redirect: "/dashboard"  // ⭐ Frontend should redirect user here
        });

      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// const contact = (res,req) =>{

// }

module.exports = { home, register, verifyToken, dashboard,login};
