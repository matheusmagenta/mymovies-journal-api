require("dotenv").config();

const axios = require("axios");

const API_KEY = process.env.API_KEY;
const Review = require("../models/review.model");

// example of api request with my api_key
// https://api.themoviedb.org/3/trending/movie/week?api_key=21545d3f8c898a2b27bafd3db0854b12
// https://api.themoviedb.org/3/movie/550?api_key=21545d3f8c898a2b27bafd3db0854b12

// TODO: DONE
// GET movie card by ID
exports.getMovieCardById = async (req, res, next) => {
  try {
    // retrieve movie details from API
    const idMovieApi = req.params.id;
    const movieDetails = await getMovieInfoFromApiByID(req.params.id);
    // console.log("movieDetails: ", movieDetails);

    // retrieve streaming info from API
    const whereToWatch = await getStreamingFromApiByID(idMovieApi);
    //console.log("whereToWatch: ", whereToWatch);

    // check if movie/review is on DATABASE
    const movieHasReview = await getAllReviewsOfMovie(idMovieApi);
    // console.log("movieHasReview:", movieHasReview);

    // response
    if (movieHasReview.length > 0) {
      return res.status(202).json({
        movieDetails,
        whereToWatch,
        movieHasReview,
      });
    } else {
      return res.status(202).json({
        movieDetails: movieDetails,
        whereToWatch: whereToWatch,
        movieHasReview: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// getting all reviews of one movie from database
async function getAllReviewsOfMovie(idMovieApi) {
  return await Review.find({ idMovieApi: idMovieApi }).populate([
    {
      path: "user",
      select: "name",
      model: "User",
    },
  ]);
}

// TODO: DONE
function getMovieInfoFromApiByID(apiID) {
  return axios
    .get(`https://api.themoviedb.org/3/movie/${apiID}`, {
      params: { api_key: API_KEY },
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));
}
// getMovieInfoFromApiByID(550);

// TODO: DONE: ATTENTION,REQUEST BY PARAMS
exports.searchByQuery = async (req, res, next) => {
  try {
    // getting query search made by user
    //const query = req.body["movie-search"];
    const query = req.params.query;

    // getting results from API
    const results = await getMoviesFromApiByQuery(query, (req.params.page = 1));

    // response
    return res.status(200).json(results);
    //res.render("results", { results, query });
  } catch (error) {
    console.log(error);
  }
};
// TODO: DONE
function getMoviesFromApiByQuery(movieQuery, pagination = 1) {
  return axios
    .get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: API_KEY,
        query: movieQuery,
        page: pagination,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.error(err));
}
// getMoviesFromApiByQuery('fight')

// TODO: DONE
exports.getTrendingMoviesFromApi = async (req, res) => {
  // retrieve movies from API
  const trendingMovies = await getTrendingMoviesFromApiWeek();
  // console.log('trendingMovies: ', trendingMovies)

  res.status(200).json(trendingMovies);
};
// TODO: DONE
async function getTrendingMoviesFromApiWeek() {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/trending/movie/week`, {
      params: { api_key: API_KEY },
    })
    .then((res) => {
      const arrayTrending = [];
      for (let i = 0; i < 19; i++) {
        arrayTrending.push({
          id: res.data.results[i].id,
          original_title: res.data.results[i].original_title,
          poster_path: res.data.results[i].poster_path,
          vote_average: res.data.results[i].vote_average,
          backdrop_path: res.data.results[i].backdrop_path,
        });
      }
      // console.log("arrayTrending: ", arrayTrending);
      return arrayTrending;
    })
    .catch((err) => console.error(err));
}
// getTrendingMoviesFromApiWeek();

async function getRecommendationFromApiByID(apiID) {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/movie/${apiID}/recommendations`, {
      params: { api_key: API_KEY },
    })
    .then((res) => {
      const arrayRecommendations = [];
      arrayRecommendations.push({
        id: res.data.results[0].id,
        original_title: res.data.results[0].original_title,
        poster_path: res.data.results[0].poster_path,
        vote_average: res.data.results[0].vote_average,
      });
      arrayRecommendations.push({
        id: res.data.results[1].id,
        original_title: res.data.results[1].original_title,
        poster_path: res.data.results[1].poster_path,
        vote_average: res.data.results[1].vote_average,
      });
      arrayRecommendations.push({
        id: res.data.results[2].id,
        original_title: res.data.results[2].original_title,
        poster_path: res.data.results[2].poster_path,
        vote_average: res.data.results[2].vote_average,
      });

      console.log("arrayRecommendations: ", arrayRecommendations);
      return arrayRecommendations;
    })
    .catch((err) => console.error(err));
}
// getMovieInfoFromApiByID(550);

async function getStreamingFromApiByID(apiID) {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/movie/${apiID}/watch/providers`, {
      params: { api_key: API_KEY },
    })
    .then((res) => {
      const arrayStreamingGB = {};

      const flatrate = [];
      const rent = [];
      const buy = [];

      const allData = res.data;
      // console.log("allData: ", allData.results["GB"].flatrate);

      //getting flatrate
      if (allData.results["GB"].flatrate) {
        allData.results["GB"].flatrate.forEach((item) => {
          flatrate.push({ item: item.provider_name, logo: item.logo_path });
        });
        arrayStreamingGB.flatrate = flatrate;
      }

      //getting rent
      if (allData.results["GB"].rent) {
        allData.results["GB"].rent.forEach((item) => {
          rent.push({ item: item.provider_name, logo: item.logo_path });
        });
        arrayStreamingGB.rent = rent;
      }

      //getting buy
      if (allData.results["GB"].buy) {
        allData.results["GB"].buy.forEach((item) => {
          buy.push({ item: item.provider_name, logo: item.logo_path });
        });
        arrayStreamingGB.buy = buy;
      }

      // console.log('arrayStreamingGB: ', arrayStreamingGB)
      return arrayStreamingGB;
    })
    .catch((err) => console.error(err));
}
// getStreamingFromApiByID(550);
