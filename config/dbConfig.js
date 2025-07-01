const mongoose = require('mongoose');

const configureDatabase = () => {
  try {
    return mongoose.connect(process.env.DB_URL)
      .then(() => console.log('Connected!'));
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = configureDatabase;