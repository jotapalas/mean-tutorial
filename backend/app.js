const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      postId: result._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched!',
        posts: documents
      })
    });
});

app.put('/api/posts/:postId', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.postId}, post)
  .then(result => {
    res.status(200).json();
  });
});

app.delete('/api/posts/:postId', (req, res, next) => {
  Post.deleteOne({_id: req.params.postId})
  .then(result => {
    res.status(200).json({ message: 'Post deleted' });
  })
  .catch(err => {

  });
});

module.exports = app;
