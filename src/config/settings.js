require('dotenv').config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌ В .env не заданы: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  validateEnv,
};
