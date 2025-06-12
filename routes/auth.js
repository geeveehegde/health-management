// Authentication routes
import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import config from '../config/configuration.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with that email or username already exists' 
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Login the user
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration' });
      }
      
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        },
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error during login' });
    }
    
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Login failed' });
    }
    
    // Login the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      });
    });
  })(req, res, next);
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      bio: req.user.bio,
      isOnline: req.user.isOnline,
      lastSeen: req.user.lastSeen,
      friends: req.user.friends
    }
  });
});

export default router;
