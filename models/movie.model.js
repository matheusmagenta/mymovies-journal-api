const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const movieSchema = new mongoose.Schema({
  idMovieApi: {
    type: String,
  },
  title: {
    type: String,
  },
  recommendations: {
    type: Array,
  },
  watchlist: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
