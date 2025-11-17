const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/Database');

const home = (req, res) => {
  try {
    res.send('Welcome to the Auth Home Page');
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const register = (req, res) => {
  try {
    const { username, email, phone, password,isadmin } = req.body;

    // 1. Check if email already exists
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server Error");
      }

      if (result.length > 0) {
        // Email already exists
        return res.status(400).send("User already exists");
      }

      // 2. Hash password BEFORE inserting
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error hashing password");
        }

        // 3. Insert new user with hashed password
        const insertQuery =
          "INSERT INTO users (username, email, phone, password,isadmin) VALUES (?, ?, ?, ?, ?)";

        db.query(
          insertQuery,
          [username, email, phone, hashedPassword,isadmin],
          (err2, result2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).send("Server Error");
            }

            return res.status(200).send("User registered successfully");
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


module.exports = { home, register };
