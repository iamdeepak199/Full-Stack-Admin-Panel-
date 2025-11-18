const express = require('express');
const router = express.Router();
const {dashboard,register,verifyToken,login} = require('../controllers/auth-controller');

router.get('/', verifyToken, dashboard);
router.get('/register',register);
router.post("/login", login);
// router.post('/contact',contact);


module.exports = router;