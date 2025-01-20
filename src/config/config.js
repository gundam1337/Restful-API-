const constructDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  return `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/aikon`;
};

const config = {
  database: {
    url: constructDatabaseUrl(),
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