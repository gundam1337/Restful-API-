const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/trustdb',
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
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