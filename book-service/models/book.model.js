const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  description: String,
  publishedYear: Number,
} ); 

module.exports = mongoose.model('Book', bookSchema);
