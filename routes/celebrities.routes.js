const express = require("express");
const router = express();
const Celebrity = require("../models/Celebrity.model");

// Iteration 3
// /celebrities/create	GET	Show a form to create a celebrity
router.get("/create", (req, res) => {
  res.render("celebrities/new-celebrity");
});



// SOLUTION 2
router.post("/create", async (req, res) => {
  try {
    const { name, occupation, catchPhrase } = req.body;

    await Celebrity.create({ name, occupation, catchPhrase });
    res.redirect("/celebrities");
  } catch (error) {
    console.log(error);
    res.render("celebrities/new-celebrity.hbs");
  }
});



// SOLUTION 2
router.get("/", async (req, res, next) => {
  try {
    const result = await Celebrity.find();
    res.render("celebrities/celebrities", { celebrities: result });
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
