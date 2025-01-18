// config.js
const config = {
    database: {
      url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/trustdb'
    },
    server: {
      port: process.env.PORT || 3000
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  };
  
  module.exports = config;