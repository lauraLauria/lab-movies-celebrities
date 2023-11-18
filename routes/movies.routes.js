const express = require("express");
const router = express();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");


router.get("/create", async (req, res, next) => {
  try {
    const celebsList = await Celebrity.find();
    res.render("movies/new-movie.hbs", { celebrities: celebsList });
  } catch (error) {
    console.log(error);
  }
});


router.post("/create", async (req, res) => {
  try {
    const { title, genre, plot, cast } = req.body;
    await Movie.create({ title, genre, plot, cast });
    res.redirect("/movies");
  } catch (error) {
    console.log(error);
    res.render("movies/new-movie");
  }
});



router.get("/", async (req, res, next) => {
  try {
    const dataFromDataBase = await Movie.find();
    res.render("movies/movies.hbs", { movies: dataFromDataBase });
  } catch (error) {
    console.log(err);
  }
});



router.get("/:movieId", async (req, res, next) => {
  const movieId = req.params.movieId;

  Movie.findById(movieId)
    .populate("cast")
    .then((foundMovie) => {
      console.log(`foundMovie`, foundMovie);

      res.render("movies/movie-details", { foundMovie });
    });
});

// Iteration 9
router.post("/:movieId/delete", (req, res) => {
  console.log(req.params.movieId);

  Movie.findByIdAndDelete(req.params.movieId)
    .then(() => {
      res.redirect("/movies");
      // res.status(200).json({ message: "Movie deleted!" });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Iteration 10
router.get("/:id/edit", (req, res) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .populate("cast")
    .then((movie) => {
      Celebrity.find()
        .then((celebrities) => {
          res.render("movies/movie-edit", { movie, celebrities });
        })
        .catch((celebritiesError) => {
          console.error(celebritiesError);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((movieError) => {
      console.error(movieError);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/:id/edit", (req, res) => {
  const movieId = req.params.id;
  const { title, genre, plot, cast } = req.body;

  Movie.findByIdAndUpdate(movieId, { title, genre, plot, cast }, { new: true })
    .populate("cast")
    .then(() => {
      res.redirect(`/movies/${movieId}`);
    })
    .catch((updateError) => {
      console.error(updateError);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
