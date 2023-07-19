require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

// const router = require('./routes/index');
const { limiter } = require('./utils/config');
const { PORT, DB_URL } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { cors } = require('./middlewares/cors');

const app = express();
app.use(express.json());
app.use(cors);

app.use(helmet());
app.use(limiter);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

// app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
