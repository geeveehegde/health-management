// Authentication middleware
import passport from 'passport';
import jwt from 'jsonwebtoken';
import jwtOptions from '../config/passport.js';
import config from '../config/configuration.js';

// Middleware to authenticate requests using JWT
export const authenticateJwt = passport.authenticate('jwt', { session: false });

// Middleware to check if the user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized access' });
};

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };
  return jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: config.auth.jwtExpiresIn });
};

export default {
  authenticateJwt,
  isAuthenticated,
  generateToken
};
