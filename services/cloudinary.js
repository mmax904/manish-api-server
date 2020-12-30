const keys = require('../config/keys');
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: keys.cloudinaryName,
    api_key: keys.cloudinaryKey,
    api_secret: keys.cloudinarySecret
});

module.exports = cloudinary;
