const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GENRES = ["FUNNY", "ROMANCE", "ACTION", "FANTANSIC"];

const bookSchema = new Schema({
  name: String,
  genre: { type: String, enum: GENRES },
  authorId: String
});

module.exports = mongoose.model("Book", bookSchema);
