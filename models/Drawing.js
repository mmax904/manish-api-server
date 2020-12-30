const mongoose = require('mongoose');
const { Schema } = mongoose;

const drawingSchema = new Schema({
  googleId: String,
  drawingUrl: String
});

module.exports = mongoose.model('Drawing', drawingSchema, 'drawings');
