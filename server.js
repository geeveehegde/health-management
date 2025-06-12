// Simple HTTP server for chat application
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import config from './config/configuration.js';
import next from 'next';
import { parse } from 'url';

// Initialize Next.js app - point to the chatui directory
const nextApp = next({ 
  dev: config.isDev,
  dir: './ui'
});
// Port for the server to listen on
const PORT = config.port;

// MongoDB connection string
const MONGODB_URI = config.mongodb.uri;
const main = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, config.mongodb.options);
    console.log('Connected to MongoDB');
    // Prepare Next.js
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();
    
    // Create the HTTP server
    const app = express();
    
    
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    // Session configuration
    const sessionStore = MongoStore.create({
      mongoUrl: MONGODB_URI,
      collection: 'sessions',
      ttl: 14 * 24 * 60 * 60, // 14 days
    });
    
    app.use(session({
      secret: config.auth.sessionSecret,
      resave: config.session.resave,
      saveUninitialized: config.session.saveUninitialized,
      store: sessionStore,
      cookie: config.session.cookie
    }));
    
    // Configure and initialize Passport
    configurePassport();
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Routes
    app.use('/api/auth', authRoutes);
    

    app.all('/{*splat}', (req, res) => {
      return handle(req, res);
    });
    
    const server = http.createServer(app);

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} in your browser`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with error
  }
}

// Connect to MongoDB 
(async () => {
  try {
    await main();
  } catch (error) {
    console.error('Fatal error starting application:', error);
    process.exit(1);
  }
})();
