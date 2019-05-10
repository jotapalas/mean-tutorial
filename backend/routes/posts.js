const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

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
  const pageSize = +req.query.pageSize || 10;
  const currentPage = +req.query.page || 1;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize*(currentPage - 1))
      .limit(pageSize);
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: 'Posts fetched!',
      posts: fetchedPosts,
      maxPosts: count
    })
  });
});

router.post('',
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) =>
{
  const baseUrl = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: baseUrl + '/img/' + req.file.filename,
    createdBy: req.userData.userId
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

router.put('/:postId',
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) =>
{
  let imagePath = req.body.imagePath;
  if (req.file) {
    const baseUrl = req.protocol + '://' + req.get('host');
    imagePath = baseUrl + '/img/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    createdBy: req.userData.userId
  });
  Post.updateOne({
    _id: req.params.postId,
    createdBy: req.userData.userId
  }, post)
  .then(result => {
    if (result.nModified === 1) {
      res.status(200).json(post);
    } else {
      res.status(401).json({ message: 'Unauthorized user' })
    }
  });
});

router.delete('/:postId',
  checkAuth,
  (req, res, next) => {
  Post.deleteOne({
    _id: req.params.postId,
    createdBy: req.userData.userId
  })
  .then(result => {
    if (result.n === 1) {
      res.status(200).json(post);
    } else {
      res.status(401).json({ message: 'Unauthorized user' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Interal error', errorDescription: err})
  });
});

module.exports = router;
