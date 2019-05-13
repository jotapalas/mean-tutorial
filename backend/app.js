const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
mongoose.connect(
  'mongodb+srv://'
  + process.env.MONGO_ATLAS_USR
  + ':'
  + process.env.MONGO_ATLAS_PW
  + '@mern-test-1t5ju.mongodb.net/mean-udemy?retryWrites=true',
  { useNewUrlParser: true }
)
.then(() => {
  console.log('Connected to database.');
})
.catch((err) => {
    console.log('Error connecting to database: ' + err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/img', express.static(path.join('backend/img')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT, OPTIONS"
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
