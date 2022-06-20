// FUNCTIONS

async function getStreamingFilteredByService(trendingMovies, service) {
  // getting trending movies
  // const trendingMovies = await getTrendingMoviesFromApiWeek()

  // array of trending movies IDs
  const arrayTrendingIDs = trendingMovies.map((item) => item.id);
  // console.log('arrayTrendingIDs: ', arrayTrendingIDs)

  // getting streaming services of each trending movie
  const mapLoop = async (_) => {
    const promises = await arrayTrendingIDs.map(async (item) => {
      const itemTest = await getStreamingFromApiByID(item);
      return { id: item, item: itemTest };
    });
    const finalTest = await Promise.all(promises);
    // console.log('finalTest: ', finalTest)
    return finalTest;
  };
  const trendingStreaming = await mapLoop();
  // console.log('trendingStreaming', trendingStreaming)

  // check if each trending movie is available of the service
  const trendingFilteredFinal = trendingStreaming
    .map((item) => {
      if (item.item) {
        const filtering = Object.values(item.item)
          .flat()
          .find((item) => item.item == service);
        console.log("filtering: ", filtering);
        return filtering !== undefined ? item.id : undefined;
      }
    })
    .filter((item) => item !== undefined);

  // console.log('trendingFilteredFinal: ', trendingFilteredFinal)

  // filter inital trending array with service filter
  const filteredArray = trendingMovies.filter((item) =>
    trendingFilteredFinal.includes(item.id)
  );

  return filteredArray;
}

async function getBestNetflixMovies(StreamingProvider, Year) {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_watch_providers: StreamingProvider,
        watch_region: "GB",
        year: Year,
        sort_by: "vote_average.desc",
      },
    })
    .then((res) => {
      // console.log('res: ', res)
      const arrayBestNetflixMovies = [];
      for (let i = 0; i < 19; i++) {
        arrayBestNetflixMovies.push({
          id: res.data.results[i].id,
          original_title: res.data.results[i].original_title,
          poster_path: res.data.results[i].poster_path,
          vote_average: res.data.results[i].vote_average,
        });
      }
      // console.log('arrayBestNetflixMovies: ', arrayBestNetflixMovies)
      return arrayBestNetflixMovies;
    })
    .catch((err) => console.error(err));
}

async function getDiscoverMovies(
  bestOrNewestSelected,
  providerCodeSelected,
  genreCodeSelected,
  keywordSelected
) {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_watch_providers: providerCodeSelected,
        watch_region: "GB",
        with_genres: genreCodeSelected,
        sort_by: bestOrNewestSelected,
        with_keywords: keywordSelected,
      },
    })
    .then((res) => {
      // console.log('res: ', res)
      // console.log('res.data.results: ', res.data.results)
      const arrayDiscoverMovies = [];
      for (let i = 0; i < 19; i++) {
        arrayDiscoverMovies.push({
          id: res.data.results[i].id,
          original_title: res.data.results[i].original_title,
          poster_path: res.data.results[i].poster_path,
          vote_average: res.data.results[i].vote_average,
        });
      }
      // console.log('arrayDiscoverMovies: ', arrayDiscoverMovies)
      return arrayDiscoverMovies;
    })
    .catch((err) => console.error(err));
}
// getDiscoverMovies();

exports.getRecommendation = async (req, res) => {
  // retrieve movies from database
  const myMoviesCollection = await MovieSchema.find({});
  const myMovies = myMoviesCollection.filter(
    (movie) => movie.movieWatchlist == false
  );

  // console.log("myMovies: ", myMovies);

  // res.render("recommendations", { myMovies });
};

async function getRecommendationFromApiByID(idMovieApi) {
  // returning data of recommendations of each movie of myMovies list, adding ID and Title from original movie
  return axios
    .get(`https://api.themoviedb.org/3/movie/${idMovieApi}/recommendations`, {
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

// checking if user is authenticated or not
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/register");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
