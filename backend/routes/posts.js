const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    cb(error, 'backend/img'); //Route is relative to server.js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension);
  }
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

router.post('',
  multer({storage: storage}).single('image'),
  (req, res, next) =>
{
  const baseUrl = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: baseUrl + '/img/' + req.file.filename
  });
  post.save().then(result => {
    res.status(201).json({
      postId: result._id,
      post: {
        ...result,
        id: result._id
      }
    });
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
