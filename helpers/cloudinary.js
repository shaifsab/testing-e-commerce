const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzkarmy8f',
  api_key: '596787482111923',
  api_secret: 'xBwYtfAf1RnMQUvrU05atMZORVs'
});

module.exports = cloudinary;