const axios = require("axios");
const mongoose = require("mongoose");

const Review = require("../models/review.model");
const User = require("../models/user.model");
const API_KEY = process.env.API_KEY;

exports.getUserReviewsFromDB = async (req, res, next) => {
  // console.log("req.params.userId: ", req.params.userId);
  try {
    // retrieve movies from database
    const movieList = await getUserReviewsFromDB(req.params.userId);
    // console.log("movieList: ", movieList);
    // response
    res.send(movieList);
  } catch (error) {
    console.log(error);
  }
};

exports.addReviewToMovieListInDB = async (req, res, next) => {
  try {
    // console.log("req.body of movie being added ", req.body);
    await saveReviewToDB(req.body);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.updateMovieListInDB = async (req, res, next) => {
  try {
    // console.log('req.params.id: ', req.params.id)

    // get movie from API and review from database
    const movieDetails = await getMovieInfoFromApiByID(req.params.id);
    const movieHasReview = await Review.findOne({
      idMovieApi: req.params.id,
    });
    //console.log("movieHasReview: ", movieHasReview);
    res.status(200).json({ movieDetails, movieHasReview });
  } catch (error) {
    console.log(error);
  }
};

exports.getToUpdateMovieListInDB = async (req, res, next) => {
  try {
    // console.log('req.params.id: ', req.params.id)

    // get movie from API and review from database
    const movieDetails = await getMovieInfoFromApiByID(req.params.id);
    const movieHasReview = await Review.findOne({
      idMovieApi: req.params.id,
    });

    res.status(200).json({ movieDetails, movieHasReview });
  } catch (error) {
    console.log(error);
  }
};

exports.postToUpdateMovieListInDB = async (req, res, next) => {
  try {
    // find and delete from database
    // console.log("req.body: ", req.body);
    await Review.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.body.data.idMongo),
    });

    // adding review to database
    await saveReviewToDB(req.body);

    // res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteFromMovieListFromDB = async (req, res, next) => {
  try {
    console.log("req.body: ", req.body.data);
    await Review.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.body.data),
    });
    //res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.addMovieToWatchListToDB = async (req, res, next) => {
  // console.log("req.body: ", req.body);
  await saveMovieToWatchlistToDB(req.body);

  res.redirect("/");
};

exports.getLatestReviewsFromDB = async (req, res, next) => {
  const response = await getReviewsFromDBSortedByDate();
  // console.log("response: ", response);
  res.send(response);
};

exports.getMostReviewedMoviesFromDB = async (req, res, next) => {
  const response = await getReviewsFromDBSortedByTotalReviews();
  // console.log("response: ", response);
  res.send(response);
};

// ------------------- //
// AUXILIARY FUNCTIONS //
// ------------------- //

// getting mymovies list from database filtering by user
async function getUserReviewsFromDB(idUserMongo) {
  // retrieve IDs from DB
  return await User.findById(idUserMongo).populate([
    {
      path: "reviews",
      model: "Review",
    },
  ]);
}

// getting all reviews from database sorted by date
async function getReviewsFromDBSortedByDate() {
  return await Review.find({})
    .sort("-createdAt")
    .populate([
      {
        path: "user",
        select: "name",
        model: "User",
      },
    ]);
}

// getting all reviews from database sorted by total of reviews
async function getReviewsFromDBSortedByTotalReviews() {
  // counting total reviews per movie
  return await Review.aggregate([
    {
      $group: {
        _id: { idMovieApi: "$idMovieApi", posterPath: "$posterPath" },
        count: { $sum: 1 },
      },
    },
  ])
    .sort("-count")
    .limit(10);
}

// FUNCTION getting movie by ID
function getMovieInfoFromApiByID(idMovieApi) {
  return axios
    .get(`https://api.themoviedb.org/3/movie/${idMovieApi}`, {
      params: { api_key: API_KEY },
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));
}

// FUNCTION adding movie to watchlist
async function saveMovieToWatchlistToDB(movieAdded) {
  // const test = await req.body
  // console.log("movieAdded: ", movieAdded);

  // adding to movie and review to database
  const movieToWatchlist = new Movie({
    idMovieApi: movieAdded["movie-id-added"],
    title: movieAdded["movie-title-added"],
    watchlist: movieAdded["movie-to-watchlist"],
  });
  // console.log("movieToWatchlist: ", movieToWatchlist);
  await movieToWatchlist.save();
}

// FUNCTION adding review to database
async function saveReviewToDB(data) {
  const movieAdded = await data.data;

  // console.log("movieAdded: ", movieAdded);

  // adding to movie and review to database

  // console.log("reviewToDB: ", reviewToDB);

  const response = await Review.create({
    idMovieApi: movieAdded.idMovieApi,
    movieTitle: movieAdded.movieTitle,
    posterPath: movieAdded.posterPath,
    voteAverage: movieAdded.voteAverage,
    title: movieAdded.title,
    description: movieAdded.description,
    starRating: movieAdded.starRating,
    user: mongoose.Types.ObjectId(movieAdded.userId),
  });
  console.log("response: ", response);
  // adding review to user model in database
  await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(movieAdded.userId) },
    { $push: { reviews: response._id } }
  );
}
