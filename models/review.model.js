const mongoose = require("mongoose");

const User = require("./user.model");

const reviewSchema = new mongoose.Schema(
  {
    idMovieApi: {
      type: String,
    },
    movieTitle: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    posterPath: {
      type: String,
    },
    voteAverage: {
      type: String,
    },
    starRating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
