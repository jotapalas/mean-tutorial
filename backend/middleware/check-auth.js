const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const splitAuth = authHeader.split(' ');
    const token = splitAuth[splitAuth.length - 1];
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed.',
      errorDescription: error
    });
  }
};