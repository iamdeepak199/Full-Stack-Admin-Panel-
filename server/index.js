const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;


app.use(express.json());
const authRouter = require('./routes/auth-router');

app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(chalk.white.bgBlue(`Server is running at http://localhost:${PORT}`));
});