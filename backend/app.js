const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: '12345',
      title: 'post',
      content: 'First post on the server'
    },
    {
      id: '54321',
      title: 'second post',
      content: 'Second post on the server'
    },
  ];
  res.status(200).json({
    message: 'Posts fetched!',
    posts: posts
  })
});

module.exports = app;
