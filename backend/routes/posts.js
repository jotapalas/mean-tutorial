const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.post('', (req, res, next) => {
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

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched!',
        posts: documents
      })
    });
});

router.get('/:postId', (req, res, next) => {
  Post.findById(req.params.postId)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found...'});
    }
  });
});

router.put('/:postId', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.postId}, post)
  .then(result => {
    res.status(200).json(post);
  });
});

router.delete('/:postId', (req, res, next) => {
  Post.deleteOne({_id: req.params.postId})
  .then(result => {
    res.status(200).json({ message: 'Post deleted' });
  })
  .catch(err => {

  });
});

module.exports = router;
