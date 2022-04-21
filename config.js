const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  redisConnection: process.env.REDIS_URL,
  appPort: process.env.APP_PORT,
  searchKeyword: process.env.SEARCH_KEYWORD,
  logFilePath: process.env.LOG_FILE_PATH
};