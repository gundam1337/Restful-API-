const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:AIKON_2@167.172.66.102:5432/aikon',
    ssl: {
      rejectUnauthorized: false
    }
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