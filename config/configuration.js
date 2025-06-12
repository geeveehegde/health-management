// Configuration settings for the chat application
const config = {
  // Server settings
  port: process.env.PORT || 4000,
  
  // MongoDB settings
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healtcare-manage',
    options: {
      // Modern MongoDB driver (v4.0.0+) no longer needs these options
    }
  },
  
  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
    sessionSecret: process.env.SESSION_SECRET || 'your_session_secret_change_in_production',
    jwtExpiresIn: '1d', // 1 day
  },
  
  // Session settings
  session: {
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict'
    },
    resave: false,
    saveUninitialized: false,
  },
  
  // Environment settings
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',
};

export default config;
