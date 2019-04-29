const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');


const app = express();
mongoose.connect(
  'mongodb+srv://jotapalas:BKj5MHaJ3ZVhYLVg@mern-test-1t5ju.mongodb.net/mean-udemy?retryWrites=true',
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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT, OPTIONS"
  );
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
