// TODO: NEED TO BE REFACTORED
// TODO: TESTING SEARCH BY DISCOVER
// TODO: HANDLE NOT SELECTED CATEGORIES
/* POST search by discover. */
router.post("/discovertest", async function (req, res, next) {
  // getting query search made by user
  const selectBestOrNewest = req.body["select-best-or-newest"];
  const selectGenre = req.body["select-genre"];
  const selectProvider = req.body["select-provider"];
  const selectKeyword = req.body["select-keyword"];
  //console.log('selectGenre: ', selectGenre)
  //console.log('selectBestOrNewest: ', selectBestOrNewest)
  //console.log('selectProvider: ', selectProvider)
  console.log("selectKeyword: ", selectKeyword);

  const bestOrNewestSelected =
    req.body["select-best-or-newest"] === "best"
      ? "vote_average.desc"
      : "release_date.desc";

  // get list of genres and convert to API code
  const genreList = {
    Action: "28",
    Adventure: "12",
    Animation: "16",
    Comedy: "35",
    Crime: "80",
    Documentary: "99",
    Drama: "18",
    Family: "10751",
    Fantasy: "14",
    History: "36",
    Horror: "27",
    Music: "10402",
    Mystery: "9648",
    Romance: "10749",
    "Science Fiction": "878",
    "TV Movie": "10770",
    Thriller: "53",
    War: "10752",
    Western: "37",
  };
  const genreCodeSelected = genreList[selectGenre];
  const genreOptionsKeys = Object.keys(genreList);

  const watchProviderList = {
    Netflix: "8",
    "Amazon Prime Video": ["119", "9"],
    "Disney Plus": "337",
    "Apple iTunes": "2",
    "Google Play Movies": "3",
    Mubi: "11",
    "Sky Go": "29",
    "Now TV": "39",
    "BBC iPlayer": "38",
  };
  const providerCodeSelected = watchProviderList[selectProvider];
  const watchProvidersOptionsKeys = Object.keys(watchProviderList);

  const keywordsList = await JSON.parse("../data/keyword_ids_01_01_2022.json");
  console.log("keywordsList: ", keywordsList);

  const keywordSelected = selectKeyword;

  //console.log('req.params.page: ', req.params.page)

  // getting results from API
  const results = await getDiscoverMovies(
    bestOrNewestSelected,
    providerCodeSelected,
    genreCodeSelected,
    keywordSelected
  );
  //console.log('results', results)

  // rendering results
  /*  res.render("resultsDiscover", {
      results: results,
      genreOptionsKeys,
      watchProvidersOptionsKeys,
    }); */
});

// TODO: NEED TO BE REFACTORED
/* GET streaming platforms for each movie */
router.get("/streaming", async (req, res) => {
  // retrieve movies from database
  const whereToWatch = await getStreamingFromApiByID(550);
  //console.log('whereToWatch: ', whereToWatch)

  /*  res.redirect("/"); */
  // res.render('streaming', { whereToWatch } )
});

// TODO: NEED TO BE REFACTORED
// TODO: TESTING DISCOVER FEATURE FROM API
// TODO: NEED TO COLLECT ID OF EACH CATEGORY OF DYNAMIC SEARCH
// /* GET filtering trending movies by streaming platform */
router.get("/discover", async (req, res) => {
  // retrieve movies from database
  const bestNetflixMovies = await getBestNetflixMovies("8", "2021");
  //console.log('bestNetflixMovies: ', bestNetflixMovies)

  const genreOptions = {
    Action: "28",
    Adventure: "12",
    Animation: "16",
    Comedy: "35",
    Crime: "80",
    Documentary: "99",
    Drama: "18",
    Family: "10751",
    Fantasy: "14",
    History: "36",
    Horror: "27",
    Music: "10402",
    Mystery: "9648",
    Romance: "10749",
    "Science Fiction": "878",
    "TV Movie": "10770",
    Thriller: "53",
    War: "10752",
    Western: "37",
  };
  const genreOptionsKeys = Object.keys(genreOptions);
  // console.log('genreOptionsKeys: ', genreOptionsKeys)

  const watchProviderList = {
    Netflix: "8",
    "Amazon Prime Video": "119",
    "Disney Plus": "337",
    "Apple iTunes": "2",
    "Google Play Movies": "3",
    Mubi: "11",
    "Sky Go": "29",
    "Now TV": "39",
    "BBC iPlayer": "38",
  };
  const watchProvidersOptionsKeys = Object.keys(watchProviderList);
  // console.log('watchProvidersOptionsKeys: ', watchProvidersOptionsKeys)

  // rendering filtered
  /* res.render("discover", {
      bestNetflixMovies: bestNetflixMovies,
      genreOptionsKeys,
      watchProvidersOptionsKeys,
    }); */
});
