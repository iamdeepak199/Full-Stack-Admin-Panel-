const express = require('express');
const router = express.Router();

const home = (req, res) => {
  try {
    res.send('Welcome to the Auth Home Page');
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const register = (req, res) => {
  try {
    res.send('Register Page');
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { home, register };
