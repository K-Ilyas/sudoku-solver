'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const { requiredFields } = require("../controllers/puzzle-fileds");
const { check, solve } = require("../middlewares/puzzle");

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post(requiredFields("puzzle"), requiredFields("coordinate"), requiredFields("value"), (req, res) => {
      check(req.body.puzzle, req.body.coordinate, req.body.value, (data, err) => {
        if (err)
          res.status(200).json(err);
        if (data)
          res.status(200).json(data);
      })
    });

  app.route('/api/solve')
    .post(requiredFields("puzzle"), (req, res) => {
      solve(req.body.puzzle, (err, data) => {
        if (err)
          res.status(200).json(err);
        if (data)
          res.status(200).json(data);
      })
    });
};
