const express = require('express');
const chalk = require('chalk');
const app = express();
const port = 3000;

const authRouter = require('./routes/auth-router');

app.use('/api', authRouter);

app.listen(port, () => {
  console.log(chalk.white.bgBlue(`Server is running at http://localhost:${port}`));
});